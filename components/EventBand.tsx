/* eslint-disable @next/next/no-img-element */
export default function EventBand() {
  return (
    <section className="event-band" id="szczegoly" aria-labelledby="ev-title">
      <div className="event-bg"><img src="/assets/bg-details.2648d1d1.svg" alt="" /></div>
      <div className="event-inner">
        <h2 id="ev-title">Szczegóły wydarzenia</h2>
        <div className="event-stats">
          <div className="event-stat"><label>Data:</label><strong>26 marca 2026 r.</strong></div>
          <div className="event-stat"><label>Godzina:</label><strong>12:00</strong></div>
          <div className="event-stat"><label>Czas trwania:</label><strong>60 min</strong></div>
          <div className="event-stat is-place"><label>Miejsce:</label><strong>Online</strong></div>
        </div>
        <p className="event-note"><b>Udział w wydarzeniu jest bezpłatny!<br /></b>Planowany czas trwania spotkania wynosi 60 minut, co pozwoli na szczegółowe omówienie wszystkich przewidzianych tematów.</p>
      </div>
    </section>
  );
}
