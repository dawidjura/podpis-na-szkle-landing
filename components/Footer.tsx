/* eslint-disable @next/next/no-img-element */
import PrivacyPdfLink from "./PrivacyPdfLink";

export default function Footer() {
  return (
    <footer className="site-footer">
      <div className="footer-bottom">
        <div className="footer-logo"><img src="/assets/logo.8fea627a.svg" alt="Euvic" /></div>
      </div>
      <div className="footer-contact">
        <h3>Kontakt</h3>
        <p>www.euvic.com/pl/</p>
        <p>
          business@euvic.pl
          <br />
          +48 32 279 49 42
        </p>
        <p>Euvic S.A.<br />ul. Przewozowa 32<br />44-100, Gliwice, Polska</p>
      </div>
      <div className="footer-legal" id="polityka-prywatnosci">
        <PrivacyPdfLink>Polityka prywatności</PrivacyPdfLink>
      </div>
    </footer>
  );
}
