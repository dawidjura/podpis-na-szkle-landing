import { NextResponse } from "next/server";
import { sendRegistrationEmail, type WebinarFormData } from "@/lib/send-registration-email";

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as Partial<WebinarFormData>;

    const { firstName, lastName, phone, email } = body;
    if (!firstName || !lastName || !phone || !email) {
      return NextResponse.json(
        { error: "Wszystkie pola oznaczone * są wymagane." },
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

    await sendRegistrationEmail({ firstName, lastName, phone, email });

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("Registration email error:", err);
    return NextResponse.json(
      { error: "Nie udało się wysłać zgłoszenia. Spróbuj ponownie." },
      { status: 500 },
    );
  }
}
