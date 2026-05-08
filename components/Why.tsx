/* eslint-disable @next/next/no-img-element */
export default function Why() {
  return (
    <section className="sec-why" aria-labelledby="why-title">
      <div className="why-inner">
        <div className="why-intro">
          <h2 id="why-title">Dlaczego wiarygodny dowód jest ważny?</h2>
          <p className="sub">Jeden brakujący element uruchamia lawinę konsekwencji operacyjnych.</p>
        </div>
        <div className="why-row">
          <div className="why-card"><span className="n">01</span><p>Brak jednoznacznego dowodu zdarzenia (czasu i miejsca)</p></div>
          <div className="why-arrow"><img src="/assets/why-arrow.8530492c.svg" alt="" width={31} height={38} /></div>
          <div className="why-card"><span className="n">02</span><p>Odbiorca kwestionuje moment i miejsce powstania szkody</p></div>
          <div className="why-arrow"><img src="/assets/why-arrow.8530492c.svg" alt="" width={31} height={38} /></div>
          <div className="why-card"><span className="n">03</span><p>Reklamacja zostaje odrzucona z powodu braku twardych dowodów</p></div>
          <div className="why-arrow"><img src="/assets/why-arrow.8530492c.svg" alt="" width={31} height={38} /></div>
          <div className="why-card"><span className="n">04</span><p>Utrata marży, opóźniony&nbsp;cashflow&nbsp;i nadwyrężone relacje z klientem</p></div>
        </div>
        <p className="closing">W logistyce wygrywa ten, kto potrafi udowodnić, co naprawdę wydarzyło się na trasie.</p>
      </div>
    </section>
  );
}
