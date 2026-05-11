/* eslint-disable @next/next/no-img-element */

export default function Hero() {
  return (
    <header className="hero-wrap" id="top">
      <div className="hero-photo" aria-hidden="true">
        <img src="/assets/hero.22c2ffda.png" alt="" width={1920} height={1047} />
      </div>
      <div className="hero-overlay" aria-hidden="true"></div>
      <div className="hero-copy">
        <p className="hero-kicker">Webinar GS1 &amp; Euvic</p>
        <h1 className="hero-h1">Podpis na szkle<br />– dowód dostawy nie do podważenia</h1>
        <p className="hero-sub">Jak budować wiarygodną dokumentację dostaw i unikać sporów w logistyce.</p>
        <p className="hero-body">Dowiedz się, jak połączyć standardy GS1 z cyfrową dokumentacją zdarzeń w transporcie, aby jednoznacznie udokumentować przebieg dostawy i skutecznie rozstrzygać reklamacje</p>
        <a className="hero-btn" href="#rejestracja">Zapisz się na webinar</a>
      </div>
    </header>
  );
}
