"use client";
/* eslint-disable @next/next/no-img-element */
import { useState, useCallback, useRef } from "react";
import { normalizePhoneNumber } from "@/lib/phone-validation";
import ThankYouModal from "./ThankYouModal";
import PrivacyPdfLink from "./PrivacyPdfLink";

export type RegistrationFormProps = {
  /** `dark` — sekcja jak w teaserze (`.sec-form--dark`). */
  variant?: "default" | "dark";
  /** `id` sekcji (kotwica); domyślnie `rejestracja` — nawigacja CTA. */
  sectionId?: string;
  /** `id` nagłówka h2 dla `aria-labelledby`. */
  headingId?: string;
  /** Prefiks `id` pól i `htmlFor` — drugi formularz musi mieć inny niż domyślny `reg`. */
  fieldIdPrefix?: string;
  /** Gdy ustawione — jedna linia nagłówka zamiast „Zarezerwuj / swoje miejsce”. */
  headingTitle?: string;
};

export default function RegistrationForm({
  variant = "default",
  sectionId = "rejestracja",
  headingId = "form-main-title",
  fieldIdPrefix = "reg",
  headingTitle,
}: RegistrationFormProps) {
  const sectionClass =
    variant === "dark" ? "sec-form sec-form--dark" : "sec-form";
  const [showModal, setShowModal] = useState(false);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [consent1, setConsent1] = useState(false);
  const [consent2, setConsent2] = useState(false);
  const formRef = useRef<HTMLFormElement>(null);
  const networkLockRef = useRef(false);

  const submitRegistration = useCallback(
    async (form: HTMLFormElement) => {
      setError(null);

      const readTrimmed = (name: string): string => {
        const el = form.elements.namedItem(name);
        return el instanceof HTMLInputElement ? el.value.trim() : "";
      };

      const phoneInput = form.elements.namedItem("phone");
      const phoneEl = phoneInput instanceof HTMLInputElement ? phoneInput : null;

      const data = {
        firstName: readTrimmed("firstName"),
        lastName: readTrimmed("lastName"),
        phone: readTrimmed("phone"),
        email: readTrimmed("email"),
      };

      if (!data.firstName || !data.lastName || !data.phone || !data.email) {
        setError("Wypełnij wszystkie wymagane pola.");
        return;
      }

      const normalizedPhone = normalizePhoneNumber(data.phone);
      if (!normalizedPhone.ok) {
        setError(normalizedPhone.error);
        phoneEl?.focus({ preventScroll: true });
        return;
      }

      if (!consent1 || !consent2) {
        setError("Zaznaczenie obu zgód jest wymagane.");
        return;
      }

      if (networkLockRef.current) return;
      networkLockRef.current = true;

      setSending(true);
      try {
        const res = await fetch("/api/webinar-zapis", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(data),
          credentials: "same-origin",
          cache: "no-store",
        });

        if (!res.ok) {
          const body = await res.json().catch(() => null);
          throw new Error(body?.error || "Błąd serwera");
        }

        if (document.activeElement instanceof HTMLElement) {
          document.activeElement.blur();
        }

        setShowModal(true);
        requestAnimationFrame(() => {
          form.reset();
          setConsent1(false);
          setConsent2(false);
        });
      } catch (err) {
        setError(err instanceof Error ? err.message : "Nie udało się wysłać zgłoszenia.");
      } finally {
        networkLockRef.current = false;
        setSending(false);
      }
    },
    [consent1, consent2],
  );

  const handleSubmit = useCallback(
    (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      void submitRegistration(e.currentTarget);
    },
    [submitRegistration],
  );

  const handleClick = useCallback(() => {
    if (formRef.current) void submitRegistration(formRef.current);
  }, [submitRegistration]);

  return (
    <>
      <section className={sectionClass} id={sectionId} aria-labelledby={headingId}>
        <img className="form-deco" src="/assets/v4.1f23f49e.svg" alt="" aria-hidden="true" />
        <div className="form-layout">
          <div className="form-left">
            <h2 id={headingId}>
              {headingTitle ?? (
                <>
                  Zarezerwuj
                  <br />
                  swoje miejsce
                </>
              )}
            </h2>
          </div>
          <div className="form-right">
            <form
              ref={formRef}
              noValidate
              onSubmit={handleSubmit}
            >
              <div className="form-grid2">
                <div className="field">
                  <label htmlFor={`${fieldIdPrefix}-firstName`}>
                    Imię <span className="req">*</span>
                  </label>
                  <input
                    id={`${fieldIdPrefix}-firstName`}
                    type="text"
                    name="firstName"
                    placeholder="Twoje imię"
                    autoComplete="given-name"
                    required
                  />
                </div>
                <div className="field">
                  <label htmlFor={`${fieldIdPrefix}-lastName`}>
                    Nazwisko <span className="req">*</span>
                  </label>
                  <input
                    id={`${fieldIdPrefix}-lastName`}
                    type="text"
                    name="lastName"
                    placeholder="Twoje nazwisko"
                    autoComplete="family-name"
                    required
                  />
                </div>
              </div>
              <div className="form-grid2">
                <div className="field">
                  <label htmlFor={`${fieldIdPrefix}-phone`}>
                    Telefon <span className="req">*</span>
                  </label>
                  <input
                    id={`${fieldIdPrefix}-phone`}
                    type="tel"
                    name="phone"
                    placeholder="Twój numer telefonu"
                    autoComplete="tel"
                    inputMode="tel"
                    required
                  />
                </div>
                <div className="field">
                  <label htmlFor={`${fieldIdPrefix}-email`}>
                    E-mail <span className="req">*</span>
                  </label>
                  <input
                    id={`${fieldIdPrefix}-email`}
                    type="email"
                    name="email"
                    placeholder="Twój e-mail"
                    autoComplete="email"
                    required
                  />
                </div>
              </div>
              <div className="form-bottom">
                <div className="form-extras">
                  <label className="privacy-row">
                    <input
                      type="checkbox"
                      className="chk"
                      checked={consent1}
                      onChange={(e) => setConsent1(e.target.checked)}
                      required
                    />
                    <span>
                      Wyrażam zgodę na przetwarzanie moich danych osobowych przez Euvic S.A. w celu rejestracji i
                      udziału w webinarze, w tym obsługi organizacyjnej wydarzenia oraz przesyłania informacji
                      związanych z jego realizacją. <span className="req">*</span>
                    </span>
                  </label>
                  <label className="privacy-row">
                    <input
                      type="checkbox"
                      className="chk"
                      checked={consent2}
                      onChange={(e) => setConsent2(e.target.checked)}
                      required
                    />
                    <span>
                      Wyrażam zgodę na kontakt telefoniczny ze strony Euvic S.A. po webinarze w celu zebrania opinii na
                      temat wydarzenia oraz moich doświadczeń związanych z tematyką webinaru.{" "}
                      <span className="req">*</span>
                    </span>
                  </label>
                  <p className="admin-notice">
                    Administratorem danych osobowych przetwarzanych w celu organizacji webinaru oraz w zakresie kontaktu
                    telefonicznego jest Euvic S.A. Zobacz{" "}
                    <PrivacyPdfLink>politykę prywatności</PrivacyPdfLink>.
                  </p>
                  <div className="obl">
                    <span className="req">*</span>
                    <span>Pola obowiązkowe</span>
                  </div>
                </div>
                <div className="form-actions">
                  {error ? (
                    <p className="form-error" role="alert">
                      {error}
                    </p>
                  ) : null}
                  <button
                    type="button"
                    className="form-submit"
                    disabled={sending}
                    onClick={handleClick}
                  >
                    {sending ? "Wysyłanie…" : "Zarejestruj się"}
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      </section>

      <ThankYouModal open={showModal} onClose={() => setShowModal(false)} />
    </>
  );
}
