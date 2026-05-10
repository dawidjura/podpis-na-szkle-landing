"use client";
/* eslint-disable @next/next/no-img-element */
import { useState, useCallback } from "react";
import ThankYouModal from "./ThankYouModal";

type RegistrationFormProps = {
  /** Domyślny: niebieski gradient jak w Figmie. `dark` — ciemnoszare tło (pierwsze wystąpienie u góry). */
  variant?: "default" | "dark";
};

export default function RegistrationForm({ variant = "default" }: RegistrationFormProps) {
  const [showModal, setShowModal] = useState(false);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [consent1, setConsent1] = useState(false);
  const [consent2, setConsent2] = useState(false);

  const handleSubmit = useCallback(async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);

    const form = e.currentTarget;
    const data = {
      firstName: (form.elements.namedItem("firstName") as HTMLInputElement).value.trim(),
      lastName: (form.elements.namedItem("lastName") as HTMLInputElement).value.trim(),
      phone: (form.elements.namedItem("phone") as HTMLInputElement).value.trim(),
      email: (form.elements.namedItem("email") as HTMLInputElement).value.trim(),
    };

    if (!data.firstName || !data.lastName || !data.phone || !data.email) {
      setError("Wypełnij wszystkie wymagane pola.");
      return;
    }

    if (!consent1 || !consent2) {
      setError("Zaznaczenie obu zgód jest wymagane.");
      return;
    }

    setSending(true);
    try {
      const res = await fetch("/api/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (!res.ok) {
        const body = await res.json().catch(() => null);
        throw new Error(body?.error || "Błąd serwera");
      }

      form.reset();
      setConsent1(false);
      setConsent2(false);
      setShowModal(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Nie udało się wysłać zgłoszenia.");
    } finally {
      setSending(false);
    }
  }, []);

  return (
    <>
      <section
        className={`sec-form${variant === "dark" ? " sec-form--dark" : ""}`}
        id={variant === "default" ? "rejestracja" : undefined}
        aria-labelledby={variant === "default" ? undefined : "form-early-title"}
      >
        {variant === "default" && (
          <img className="form-deco" src="/assets/v4.1f23f49e.svg" alt="" aria-hidden="true" />
        )}
        <div className="form-layout">
          <div className="form-left">
            <h2 id={variant === "dark" ? "form-early-title" : undefined}>Zarezerwuj<br />swoje miejsce</h2>
            <p>* Liczba miejsc jest ograniczona, aby zapewnić komfortową przestrzeń do rozmów i wymiany doświadczeń.</p>
          </div>
          <div className="form-right">
            <form noValidate onSubmit={handleSubmit}>
              <div className="form-grid2">
                <div className="field"><label>Imię <span className="req">*</span></label><input type="text" name="firstName" placeholder="Twoje imię" autoComplete="given-name" required /></div>
                <div className="field"><label>Nazwisko <span className="req">*</span></label><input type="text" name="lastName" placeholder="Twoje nazwisko" autoComplete="family-name" required /></div>
              </div>
              <div className="form-grid2">
                <div className="field"><label>Telefon <span className="req">*</span></label><input type="tel" name="phone" placeholder="Twój numer telefonu" autoComplete="tel" required /></div>
                <div className="field"><label>E-mail <span className="req">*</span></label><input type="email" name="email" placeholder="Your working email" autoComplete="email" required /></div>
              </div>
              <div className="form-bottom">
                <div className="form-extras">
                  <label className="privacy-row">
                    <input type="checkbox" className="chk" checked={consent1} onChange={(e) => setConsent1(e.target.checked)} required />
                    <span>Wyrażam zgodę na przetwarzanie moich danych osobowych przez Euvic S.A. w celu rejestracji i udziału w webinarze, w tym obsługi organizacyjnej wydarzenia oraz przesyłania informacji związanych z jego realizacją. <span className="req">*</span></span>
                  </label>
                  <label className="privacy-row">
                    <input type="checkbox" className="chk" checked={consent2} onChange={(e) => setConsent2(e.target.checked)} required />
                    <span>Wyrażam zgodę na kontakt telefoniczny ze strony Euvic S.A. po webinarze w celu zebrania opinii na temat wydarzenia oraz moich doświadczeń związanych z tematyką webinaru. <span className="req">*</span></span>
                  </label>
                  <p className="admin-notice">Administratorem danych osobowych przetwarzanych w celu organizacji webinaru oraz w zakresie kontaktu telefonicznego jest Euvic S.A. Zobacz <a href="/assets/2026-01-02-klauzula-EUV-dla-osob-rejestrujacych-sie-na-wydarzenia.pdf" target="_blank" rel="noopener noreferrer">politykę prywatności</a>.</p>
                  <div className="obl"><span className="req">*</span><span>Pola obowiązkowe</span></div>
                </div>
                {error && <p className="form-error">{error}</p>}
                <button type="submit" className="form-submit" disabled={sending}>
                  {sending ? "Wysyłanie…" : "Zapisz się na webinar"}
                </button>
              </div>
            </form>
          </div>
        </div>
      </section>

      <ThankYouModal open={showModal} onClose={() => setShowModal(false)} />
    </>
  );
}
