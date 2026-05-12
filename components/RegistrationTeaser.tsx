/* eslint-disable @next/next/no-img-element */
/** Górna sekcja „Zarezerwuj miejsce” — bez drugiego formularza (jeden formularz = mniej problemów z Safari / autofill). */
export default function RegistrationTeaser() {
  return (
    <section className="sec-form sec-form--dark" aria-labelledby="form-early-title">
      <div className="form-layout">
        <div className="form-left">
          <h2 id="form-early-title">
            Zarezerwuj
            <br />
            swoje miejsce
          </h2>
          <p>
            * Liczba miejsc jest ograniczona, aby zapewnić komfortową przestrzeń do rozmów i wymiany doświadczeń.
          </p>
        </div>
        <div className="form-right form-teaser-right">
          <p className="form-teaser-lead">
            Formularz zapisu jest poniżej na stronie — kliknij przycisk, aby do niego przejść.
          </p>
          <a className="form-submit form-submit--anchor" href="#rejestracja">
            Przejdź do formularza zapisu
          </a>
        </div>
      </div>
    </section>
  );
}
