/* eslint-disable @next/next/no-img-element */
export default function Footer() {
  return (
    <footer className="site-footer">
      <div className="footer-bottom">
        <div className="footer-logo"><img src="/assets/logo.8fea627a.svg" alt="Euvic" /></div>
      </div>
      <div className="footer-contact">
        <h3>Kontakt</h3>
        <p>www.euvic.com/pl/</p>
        <p><a href="mailto:business@euvic.pl">business@euvic.pl</a><br /><a href="tel:+48322794942">+48 32 279 49 42</a></p>
        <p>Euvic S.A.<br />ul. Przewozowa 32<br />44-100, Gliwice, Polska</p>
      </div>
      <div className="footer-legal" id="polityka-prywatnosci">
        <a href="/assets/2026-01-02-klauzula-EUV-dla-osob-rejestrujacych-sie-na-wydarzenia.pdf" target="_blank" rel="noopener noreferrer">Polityka prywatności</a>
      </div>
    </footer>
  );
}
