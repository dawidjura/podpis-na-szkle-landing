/* eslint-disable @next/next/no-img-element */
// Figma: „Szczegóły wydarzenia” — Group 2623 (256:18029), layout treści 256:18034; style `.event-band` w globals.css.
export default function EventBand() {
  return (
    <section className="event-band" id="szczegoly" aria-labelledby="ev-title">
      <div className="event-bg"><img src="/assets/bg-details.2648d1d1.svg" alt="" /></div>
      <div className="event-inner">
        <h2 id="ev-title">Szczegóły wydarzenia</h2>
        <div className="event-stats">
          <div className="event-stat">
            <label>Data:</label>
            <strong>
              26 czerwca 2026{"\u00A0"}r.
            </strong>
          </div>
          <div className="event-stat"><label>Godzina:</label><strong>12:00</strong></div>
          <div className="event-stat"><label>Czas trwania:</label><strong>60 min</strong></div>
          <div className="event-stat is-place"><label>Forma:</label><strong>Bezpłatny</strong></div>
        </div>
      </div>
    </section>
  );
}
