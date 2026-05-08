/* eslint-disable @next/next/no-img-element */
export default function Agenda() {
  return (
    <section className="sec-agenda" id="agenda" aria-labelledby="ag-title">
      <h2 id="ag-title">Agenda spotkania</h2>
      <div className="timeline">
        <div className="timeline-outer">
          <div className="timeline-track">
            <div className="timeline-line" aria-hidden="true"></div>
            <div className="tl-grid">
              <div className="tl-item top">
                <div className="tl-num">01</div>
                <div className="tl-connector"><img src="/assets/union1.206a9414.svg" alt="" /></div>
                <div className="tl-dot"><img src="/assets/ell85.b7cda8ed.svg" alt="" /></div>
                <div className="tl-body">
                  <h3>Wyzwania w dokumentowaniu dostaw</h3>
                  <p>Zagubione dokumenty WZ/CMR, zdjęcia w komunikatorach i brak jednego cyfrowego śladu zdarzeń.</p>
                </div>
              </div>
              <div className="tl-item bot">
                <div className="tl-num">02</div>
                <div className="tl-connector"><img src="/assets/union.74fd3637.svg" alt="" /></div>
                <div className="tl-dot"><img src="/assets/ell86.2062d1cf.svg" alt="" /></div>
                <div className="tl-body">
                  <p>Jednoznaczna identyfikacja jednostki logistycznej jako fundament wiarygodnych danych o dostawie</p>
                  <h3>Standardy GS1 (SSCC, GTIN, GLN)</h3>
                </div>
              </div>
              <div className="tl-item top">
                <div className="tl-num">03</div>
                <div className="tl-connector"><img src="/assets/union1.206a9414.svg" alt="" /></div>
                <div className="tl-dot"><img src="/assets/ell85.b7cda8ed.svg" alt="" /></div>
                <div className="tl-body">
                  <h3>Cyfrowy dowód dostawy</h3>
                  <p>Jak dokumentować zdarzenia na trasie: podpis odbiorcy, zdjęcia, geolokalizacja i timestamp.</p>
                </div>
              </div>
              <div className="tl-item bot">
                <div className="tl-num">04</div>
                <div className="tl-connector"><img src="/assets/union.74fd3637.svg" alt="" /></div>
                <div className="tl-dot"><img src="/assets/ell86.2062d1cf.svg" alt="" /></div>
                <div className="tl-body">
                  <p>Dyskusja o realnych scenariuszach, reklamacjach i wyzwaniach w logistyce.</p>
                  <h3>Panel Q&amp;A</h3>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
