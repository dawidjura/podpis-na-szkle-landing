import { NextResponse } from "next/server";
import {
  ClickMeetingConfigError,
  ClickMeetingRegistrationError,
  registerClickMeetingParticipant,
} from "@/lib/clickmeeting-register";
import { normalizePhoneNumber } from "@/lib/phone-validation";
import { insertWebinarSignup } from "@/lib/insert-webinar-signup";
import { checkRateLimit, getClientIp } from "@/lib/rate-limit";
import {
  sendRegistrationEmail,
  sendStaffSignupNotification,
  type WebinarFormData,
} from "@/lib/send-registration-email";

export async function POST(request: Request) {
  const rateLimit = checkRateLimit(getClientIp(request));
  if (!rateLimit.ok) {
    return NextResponse.json(
      { error: "Zbyt wiele prób rejestracji. Spróbuj ponownie za chwilę." },
      {
        status: 429,
        headers: { "Retry-After": String(rateLimit.retryAfter) },
      },
    );
  }

  try {
    const body = (await request.json()) as Partial<WebinarFormData>;

    const firstName = typeof body.firstName === "string" ? body.firstName.trim() : "";
    const lastName = typeof body.lastName === "string" ? body.lastName.trim() : "";
    const phone = typeof body.phone === "string" ? body.phone.trim() : "";
    const email = typeof body.email === "string" ? body.email.trim() : "";
    if (!firstName || !lastName || !phone || !email) {
      return NextResponse.json(
        { error: "Wszystkie pola oznaczone * są wymagane." },
        { status: 400 },
      );
    }

    const normalizedPhone = normalizePhoneNumber(phone);
    if (!normalizedPhone.ok) {
      return NextResponse.json(
        { error: normalizedPhone.error },
        { status: 400 },
      );
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: "Podaj prawidłowy adres e-mail." },
        { status: 400 },
      );
    }

    const emailNorm = email.toLowerCase();
    const consentMarketing = body.consentMarketing === true;

    const { joinUrl } = await registerClickMeetingParticipant({
      firstName,
      lastName,
      email: emailNorm,
    });

    await insertWebinarSignup({
      name: firstName,
      surname: lastName,
      phone_number: normalizedPhone.phone,
      email: emailNorm,
      consent_marketing: consentMarketing,
    });

    const payload = {
      firstName,
      lastName,
      phone: normalizedPhone.phone,
      email: emailNorm,
      consentMarketing,
      webinarJoinUrl: joinUrl,
    };
    const [toParticipant, toStaff] = await Promise.allSettled([
      sendRegistrationEmail(payload),
      sendStaffSignupNotification(payload),
    ]);

    if (toParticipant.status === "rejected") {
      throw toParticipant.reason;
    }
    if (toStaff.status === "rejected") {
      console.error("Staff signup notification failed:", toStaff.reason);
    }

    return NextResponse.json({ ok: true });
  } catch (err) {
    if (err instanceof ClickMeetingConfigError) {
      console.error("Registration config error:", err.message);
      return NextResponse.json(
        { error: "Rejestracja tymczasowo niedostępna. Skontaktuj się z organizatorem." },
        { status: 503 },
      );
    }
    if (err instanceof ClickMeetingRegistrationError) {
      return NextResponse.json({ error: err.message }, { status: err.httpStatus });
    }
    const errText =
      err instanceof Error
        ? `${err.message} ${(err as { details?: string }).details ?? ""}`
        : String(err);

    if (/supabase|ENOTFOUND|fetch failed/i.test(errText)) {
      console.error("Registration CRM error:", err);
      return NextResponse.json(
        {
          error:
            "Zapis w CRM nie powiódł się (problem z Supabase). Lokalnie możesz ustawić ENV=PRODUCTION w .env, aby użyć Pipedrive.",
        },
        { status: 503 },
      );
    }

    console.error("Registration error:", err);
    return NextResponse.json(
      { error: "Nie udało się wysłać zgłoszenia. Spróbuj ponownie." },
      { status: 500 },
    );
  }
}
