export type ClickMeetingParticipant = {
  firstName: string;
  lastName: string;
  email: string;
};

export type ClickMeetingRegistrationResult = {
  joinUrl: string;
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

type ConferenceDetails = {
  name?: string;
  room_url?: string;
  registration_enabled?: number | boolean;
};

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

/** Publiczny URL pokoju z .env (fallback gdy API nie zwróci room_url). */
function getStaticWebinarRoomUrl(): string {
  const url = process.env.CLICKMEETING_WEBINAR_URL?.trim();
  if (!url) return "";
  return url.replace(/\/$/, "");
}

function appendQueryParam(baseUrl: string, key: string, value: string): string {
  const url = new URL(baseUrl);
  url.searchParams.set(key, value);
  return url.toString();
}

function participantNickname(participant: ClickMeetingParticipant): string {
  const name = [participant.firstName, participant.lastName]
    .filter(Boolean)
    .join(" ")
    .trim();
  return name || participant.email;
}

async function fetchConference(
  apiKey: string,
  roomId: string,
): Promise<ConferenceDetails> {
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

  try {
    const json = JSON.parse(raw) as { conference?: ConferenceDetails };
    return json.conference ?? {};
  } catch {
    return {};
  }
}

function assertRegistrationEnabled(conference: ConferenceDetails, roomId: string): void {
  const registrationOn =
    conference.registration_enabled === 1 || conference.registration_enabled === true;

  if (!registrationOn) {
    throw new ClickMeetingRegistrationError(
      `Rejestracja jest wyłączona w ClickMeeting dla pokoju „${conference.name ?? roomId}”. Włącz ją w panelu: Rejestracja → Włącz.`,
      503,
    );
  }
}

function resolveConferenceRoomUrl(conference: ConferenceDetails): string {
  const fromApi = conference.room_url?.trim();
  if (fromApi) return fromApi.replace(/\/$/, "");
  return getStaticWebinarRoomUrl();
}

function isDuplicateRegistration(message: string, status: number): boolean {
  if (status === 409) return true;
  return /already|duplicate|exist|registered/i.test(message);
}

/**
 * Auto-login URL — uczestnik wchodzi bez ponownego logowania.
 * @see https://dev.clickmeeting.com/api-guide/conferences/auto-login-url/
 */
async function createAutologinJoinUrl(
  apiKey: string,
  roomId: string,
  participant: ClickMeetingParticipant,
  roomUrl: string,
): Promise<string> {
  const fallback = roomUrl || getStaticWebinarRoomUrl();
  if (!fallback) {
    console.error("[ClickMeeting] Brak room_url i CLICKMEETING_WEBINAR_URL — nie można zbudować linku.");
    return "";
  }

  const body = new URLSearchParams();
  body.set("email", participant.email);
  body.set("nickname", participantNickname(participant));
  body.set("role", "listener");

  const res = await fetch(
    `https://api.clickmeeting.com/v1/conferences/${encodeURIComponent(roomId)}/room/autologin_hash`,
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
  let parsed: { autologin_hash?: string; message?: string } | null = null;
  if (raw) {
    try {
      parsed = JSON.parse(raw) as { autologin_hash?: string; message?: string };
    } catch {
      parsed = null;
    }
  }

  const hash = parsed?.autologin_hash?.trim();
  if (res.ok && hash) {
    return appendQueryParam(fallback, "l", hash);
  }

  console.error(
    "[ClickMeeting] autologin_hash failed:",
    res.status,
    parsed?.message ?? raw.slice(0, 300),
  );
  return fallback;
}

/**
 * Rejestruje uczestnika w pokoju ClickMeeting (API v1) i zwraca link auto-login do maila.
 * @see https://dev.clickmeeting.com/api-doc/ — Register participant
 */
export async function registerClickMeetingParticipant(
  participant: ClickMeetingParticipant,
): Promise<ClickMeetingRegistrationResult> {
  const { apiKey, roomId } = getClickMeetingConfig();

  const conference = await fetchConference(apiKey, roomId);
  assertRegistrationEnabled(conference, roomId);
  const roomUrl = resolveConferenceRoomUrl(conference);

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

  if (!res.ok || (parsed?.status !== "OK" && !parsed?.url)) {
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

  const joinUrl = await createAutologinJoinUrl(apiKey, roomId, participant, roomUrl);
  return { joinUrl };
}

export type AutologinParticipant = {
  email: string;
  firstName?: string;
  lastName?: string;
  name?: string;
};

function resolveParticipantNames(p: AutologinParticipant): ClickMeetingParticipant {
  if (p.firstName || p.lastName) {
    return {
      email: p.email.trim().toLowerCase(),
      firstName: p.firstName?.trim() ?? "",
      lastName: p.lastName?.trim() ?? "",
    };
  }
  const full = (p.name ?? "").trim();
  if (full) {
    const parts = full.split(/\s+/);
    return {
      email: p.email.trim().toLowerCase(),
      firstName: parts[0] ?? "",
      lastName: parts.slice(1).join(" "),
    };
  }
  const local = p.email.split("@")[0] ?? p.email;
  return {
    email: p.email.trim().toLowerCase(),
    firstName: local,
    lastName: "",
  };
}

/**
 * Osobisty link auto-login dla już zarejestrowanego uczestnika (bez ponownej rejestracji).
 */
export async function getAutologinJoinUrl(
  participant: AutologinParticipant,
): Promise<string> {
  const { apiKey, roomId } = getClickMeetingConfig();
  const conference = await fetchConference(apiKey, roomId);
  const roomUrl = resolveConferenceRoomUrl(conference);
  const resolved = resolveParticipantNames(participant);
  return createAutologinJoinUrl(apiKey, roomId, resolved, roomUrl);
}
