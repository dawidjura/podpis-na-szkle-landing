/* eslint-disable @next/next/no-img-element */
export default function Program() {
  return (
    <section className="sec-program" id="program">
      <div className="sec-program-inner">
        <div className="sec-program-stack">
          <div className="sec-program-heading-row">
            <h2>W programie czeka na Ciebie:</h2>
            <div className="sec-program-trytytka" aria-hidden="true">
              <img src="/assets/trytytka.5b2eace9.svg" alt="" width={612} height={29} />
            </div>
          </div>
          <div className="program-cols">
            <div className="program-col">
              <div className="program-min">30 min</div>
              <div className="program-body">
                <h3>Wprowadzenia eksperckiego</h3>
                <p>Pokażemy, jak w praktyce działa cyfrowy dowód dostawy – od standardów identyfikacji GS1 po budowę wiarygodnej dokumentacji zdarzeń w procesie transportu.</p>
              </div>
            </div>
            <div className="program-col">
              <div className="program-min">30 min</div>
              <div className="program-body">
                <h3>Dyskusji na żywo</h3>
                <p>Poprowadzimy otwartą rozmowę z ekspertami. Możesz zadać pytanie, przeanalizować własny scenariusz reklamacyjny i sprawdzić, jak takie sytuacje dokumentować w praktyce.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
