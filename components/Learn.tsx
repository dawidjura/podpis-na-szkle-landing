/* eslint-disable @next/next/no-img-element */
export default function Learn() {
  return (
    <section className="sec-learn" id="oferta" aria-labelledby="learn-title">
      <div className="sec-learn-top-bar" aria-hidden="true" />
      <div className="sec-learn-bottom-bar" aria-hidden="true" />
      <div className="learn-inner">
        <div className="learn-visual">
          <div className="learn-visual-flip">
            <div className="learn-visual-crop">
              <img src="/assets/adobe-stock-440299419.468fca9e.jpg" alt="" />
            </div>
          </div>
        </div>
        <div className="learn-split-svg"><img src="/assets/learn-vector.fc9cec0e.svg" alt="" /></div>
        <img className="learn-try" src="/assets/learn-trytytka.e6197563.svg" alt="" width={612} height={29} />
        <div className="learn-copy">
          <h2 id="learn-title">Czego dowiesz się podczas webinaru?</h2>
          <div className="learn-body">
            <p className="intro">Pokażemy, jak cyfrowy ślad danych zmienia sposób dokumentowania dostaw:</p>
            <ul>
              <li><strong>Standardy i cyfrowy dowód dostawy</strong><span className="light">Jak połączyć standardy identyfikacji GS1 z cyfrową dokumentacją zdarzeń w transporcie.</span></li>
              <li><strong>Zamykanie sporów</strong><span className="light">Jak jednoznacznie dokumentować zdarzenia dostawy, aby szybko rozstrzygać reklamacje.</span></li>
              <li><strong>Gotowość na e‑CMR</strong><span className="light">Jak przygotować proces dostawy na cyfrowe dokumenty transportowe i rosnące wymagania sieci handlowych.</span></li>
              <li><strong>Szybsze rozliczenia</strong><span className="light">Jak cyfrowa dokumentacja dostawy eliminuje ręczne sprawdzanie statusów i przyspiesza proces fakturowania.</span></li>
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}
