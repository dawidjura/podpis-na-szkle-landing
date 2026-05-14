/* eslint-disable @next/next/no-img-element */
export default function Consult() {
  return (
    <section className="sec-consult">
      <div className="consult-vector" aria-hidden="true"><img src="/assets/consult-vector.svg" alt="" /></div>
      <div className="consult-photo"><img src="/assets/Darek Mikołajczak.png" alt="Dariusz Mikołajczak" /></div>
      <div className="consult-content">
        <div className="consult-content-inner">
          <h2>Bezpłatna konsultacja procesu dostaw</h2>
          <p className="lead">
            Po webinarze możesz zapisać się na krótką konsultację z ekspertem, aby omówić swój proces logistyczny.
          </p>
          <ul>
            <li>przeanalizujemy proces dostaw</li>
            <li>sprawdzimy sposób dokumentowania zdarzeń</li>
            <li>wskażemy możliwe usprawnienia</li>
          </ul>
          <div className="consult-person">
            <p className="name">Dariusz Mikołajczak</p>
            <p className="title">
              Business Development Manager &nbsp;- Supply Chain
              <br />
              Wieloletnie doświadczenie w branży logistycznej
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
