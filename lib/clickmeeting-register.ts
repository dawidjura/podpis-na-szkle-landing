export type ClickMeetingParticipant = {
  firstName: string;
  lastName: string;
  email: string;
};

export class ClickMeetingConfigError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "ClickMeetingConfigError";
  }
}

export class ClickMeetingRegistrationError extends Error {
  readonly httpStatus: number;

  constructor(message: string, httpStatus = 502) {
    super(message);
    this.name = "ClickMeetingRegistrationError";
    this.httpStatus = httpStatus;
  }
}

/** API używa pola `id` konferencji, nie `room_pin` z adresu pokoju (np. …/288686738). */
function normalizeConferenceId(raw: string): string {
  return raw.replace(/\D/g, "");
}

function getClickMeetingConfig(): { apiKey: string; roomId: string } {
  const apiKey = process.env.CLICKMEETING_API_KEY?.trim();
  const roomIdRaw = process.env.CLICKMEETING_ROOM_ID?.trim();
  if (!apiKey || !roomIdRaw) {
    throw new ClickMeetingConfigError(
      "Brak konfiguracji ClickMeeting (CLICKMEETING_API_KEY / CLICKMEETING_ROOM_ID).",
    );
  }
  const roomId = normalizeConferenceId(roomIdRaw);
  if (!roomId) {
    throw new ClickMeetingConfigError("CLICKMEETING_ROOM_ID jest puste lub nieprawidłowe.");
  }
  return { apiKey, roomId };
}

async function assertConferenceReady(
  apiKey: string,
  roomId: string,
): Promise<void> {
  const res = await fetch(`https://api.clickmeeting.com/v1/conferences/${roomId}`, {
    headers: { "X-Api-Key": apiKey },
    cache: "no-store",
  });

  const raw = await res.text();
  if (!res.ok) {
    console.error("[ClickMeeting] conference GET failed:", res.status, raw.slice(0, 300));
    throw new ClickMeetingRegistrationError(
      res.status === 404
        ? "Nie znaleziono pokoju w ClickMeeting. W .env ustaw CLICKMEETING_ROOM_ID na pole id z API (np. 9984434 dla testu), nie room_pin z URL."
        : "Błąd konfiguracji pokoju ClickMeeting.",
      res.status === 404 ? 404 : 502,
    );
  }

  let conference: { name?: string; registration_enabled?: number | boolean } | undefined;
  try {
    const json = JSON.parse(raw) as { conference?: { name?: string; registration_enabled?: number | boolean } };
    conference = json.conference;
  } catch {
    return;
  }

  const registrationOn =
    conference?.registration_enabled === 1 ||
    conference?.registration_enabled === true;

  if (!registrationOn) {
    throw new ClickMeetingRegistrationError(
      `Rejestracja jest wyłączona w ClickMeeting dla pokoju „${conference?.name ?? roomId}”. Włącz ją w panelu: Rejestracja → Włącz.`,
      503,
    );
  }
}

function isDuplicateRegistration(message: string, status: number): boolean {
  if (status === 409) return true;
  return /already|duplicate|exist|registered/i.test(message);
}

/**
 * Rejestruje uczestnika w pokoju ClickMeeting (API v1).
 * @see https://dev.clickmeeting.com/api-doc/ — Register participant
 */
export async function registerClickMeetingParticipant(
  participant: ClickMeetingParticipant,
): Promise<void> {
  const { apiKey, roomId } = getClickMeetingConfig();

  await assertConferenceReady(apiKey, roomId);

  const body = new URLSearchParams();
  body.set("registration[1]", participant.firstName);
  body.set("registration[2]", participant.lastName);
  body.set("registration[3]", participant.email);
  body.set("lang", "pl");

  const res = await fetch(
    `https://api.clickmeeting.com/v1/conferences/${encodeURIComponent(roomId)}/registration`,
    {
      method: "POST",
      headers: {
        "X-Api-Key": apiKey,
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: body.toString(),
      cache: "no-store",
    },
  );

  const raw = await res.text();
  let parsed: { status?: string; message?: string; url?: string } | null = null;
  if (raw) {
    try {
      parsed = JSON.parse(raw) as { status?: string; message?: string; url?: string };
    } catch {
      parsed = null;
    }
  }

  if (res.ok && (parsed?.status === "OK" || parsed?.url)) {
    return;
  }

  const detail =
    typeof parsed?.message === "string"
      ? parsed.message
      : raw.slice(0, 500) || `HTTP ${res.status}`;

  if (res.status === 404 || /not found|room not found/i.test(detail)) {
    throw new ClickMeetingRegistrationError(
      "Nie znaleziono pokoju w ClickMeeting. Sprawdź CLICKMEETING_ROOM_ID (id API, np. 9984434 dla „Test embedowania 1”).",
      404,
    );
  }

  if (isDuplicateRegistration(detail, res.status)) {
    throw new ClickMeetingRegistrationError(
      "Ten adres e-mail jest już zarejestrowany na to wydarzenie.",
      409,
    );
  }

  console.error("ClickMeeting registration failed:", res.status);

  throw new ClickMeetingRegistrationError(
    "Nie udało się zarejestrować na webinar. Spróbuj ponownie za chwilę.",
    res.status >= 400 && res.status < 600 ? res.status : 502,
  );
}
