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
            Po webinarze możesz umówić się na bezpłatną konsultację, podczas której:
          </p>
          <ul>
            <li>ocenisz poziom cyfrowej dojrzałości procesów logistycznych w swojej organizacji,</li>
            <li>poznasz możliwe sposoby ograniczania problemów i niejasności w łańcuchu dostaw,</li>
            <li>dowiesz się więcej o rozwiązaniach wspierających dokumentowanie i monitorowanie procesów logistycznych.</li>
          </ul>
          <p className="consult-host-kicker">Spotkanie poprowadzi</p>
          <div className="consult-person">
            <p className="name">Dariusz Mikołajczak</p>
            <p className="title">Business Development Manager&nbsp;- Supply Chain</p>
          </div>
          <p className="consult-bio">
            Posiada wieloletnie doświadczenie w zarządzaniu transformacją w obszarze Supply Chain i
            Procurement, obejmujące zarówno środowiska korporacyjne o zasięgu globalnym, jak i
            organizacje rozwijające się oraz projekty konsultingowe. Łączy perspektywę biznesową i
            technologiczną koncentrując się na wspieraniu organizacji w transformacji i digitalizacji
            łańcucha dostaw, ze szczególnym uwzględnieniem poprawy efektywności operacyjnej, redukcji
            kosztów oraz budowy skalowalnych i odpornych na zakłócenia struktur operacyjnych.
          </p>
        </div>
      </div>
    </section>
  );
}
