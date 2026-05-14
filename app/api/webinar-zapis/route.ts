import { NextResponse } from "next/server";
import { normalizePhoneNumber } from "@/lib/phone-validation";
import { insertWebinarSignup } from "@/lib/supabase-admin";
import {
  sendRegistrationEmail,
  sendStaffSignupNotification,
  type WebinarFormData,
} from "@/lib/send-registration-email";

export async function POST(request: Request) {
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

    await insertWebinarSignup({
      name: firstName,
      surname: lastName,
      phone_number: normalizedPhone.phone,
      email: emailNorm,
    });

    const payload = { firstName, lastName, phone: normalizedPhone.phone, email: emailNorm };
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
    console.error("Registration error:", err);
    const code =
      err && typeof err === "object" && "code" in err ? String((err as { code: unknown }).code) : "";
    if (code === "23505") {
      return NextResponse.json(
        { error: "Na ten adres e-mail jest już zapis." },
        { status: 409 },
      );
    }
    return NextResponse.json(
      { error: "Nie udało się wysłać zgłoszenia. Spróbuj ponownie." },
      { status: 500 },
    );
  }
}
