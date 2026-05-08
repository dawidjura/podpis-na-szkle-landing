"use client";
/* eslint-disable @next/next/no-img-element */

export default function RegistrationForm() {
  return (
    <section className="sec-form" id="rejestracja">
      <img className="form-deco" src="/assets/v4.1f23f49e.svg" alt="" aria-hidden="true" />
      <div className="form-layout">
        <div className="form-left">
          <h2>Zarezerwuj<br />swoje miejsce</h2>
          <p>* Liczba miejsc jest ograniczona, aby zapewnić komfortową przestrzeń do rozmów i wymiany doświadczeń.</p>
        </div>
        <div className="form-right">
          <form noValidate onSubmit={(e) => e.preventDefault()}>
            <div className="form-grid2">
              <div className="field"><label>Imię <span className="req">*</span></label><input type="text" name="firstName" placeholder="Twoje imię" autoComplete="given-name" required /></div>
              <div className="field"><label>Nazwisko <span className="req">*</span></label><input type="text" name="lastName" placeholder="Twoje nazwisko" autoComplete="family-name" required /></div>
              <div className="field"><label>Firma <span className="req">*</span></label><input type="text" name="company" placeholder="Nazwa firmy" autoComplete="organization" required /></div>
            </div>
            <div className="form-grid2">
              <div className="field"><label>Stanowisko <span className="req">*</span></label><input type="text" name="title" placeholder="Twoje stanowisko" autoComplete="organization-title" required /></div>
              <div className="field"><label>Telefon <span className="req">*</span></label><input type="tel" name="phone" placeholder="Twój numer telefonu" autoComplete="tel" required /></div>
              <div className="field"><label>E-mail <span className="req">*</span></label><input type="email" name="email" placeholder="Your working email" autoComplete="email" required /></div>
            </div>
            <div className="form-bottom">
              <div className="form-extras">
                <div className="privacy-row"><span className="chk" aria-hidden="true"></span><span>I Agree to Privacy Policy</span></div>
                <div className="obl"><span className="req">*</span><span>Obligatory fields</span></div>
              </div>
              <button type="submit" className="form-submit">Zapisz się na webinar</button>
            </div>
          </form>
        </div>
      </div>
    </section>
  );
}
