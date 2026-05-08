/* eslint-disable @next/next/no-img-element */
export default function Guests() {
  return (
    <section className="sec-guests" id="prelegenci" aria-labelledby="g-title">
      <h2 id="g-title">Eksperci prowadzący webinar</h2>
      <div className="guest-grid">
        <article className="guest">
          <div className="guest-photo">
            <img src="/assets/ph0-sokolowski.png" alt="Grzegorz Sokołowski" />
          </div>
          <h3>Grzegorz Sokołowski</h3>
          <p className="role">prelegent</p>
          <div className="rule"><img src="/assets/line-rule.99be3ec4.svg" alt="" /></div>
          <p className="bio">Specjalista w zakresie standardów identyfikacyjnych i traceability. Odpowiada za standaryzację danych logistycznych (SSCC, e&#8209;CMR), budując jednoznaczność informacji w łańcuchach dostaw.</p>
        </article>
        <article className="guest">
          <div className="guest-photo">
            <img src="/assets/ph1-gacioch.jpg" alt="Janina Gacioch‑Gruszecka" />
          </div>
          <h3>Janina Gacioch&#8209;Gruszecka</h3>
          <p className="role">prelegent</p>
          <div className="rule"><img src="/assets/line-rule.99be3ec4.svg" alt="" /></div>
          <p className="bio">Specjalistka ds. cyfryzacji procesów TSL. Odpowiada za wdrożenia systemu ePOD, pomagając firmom eliminować papier i zabezpieczać dowody dostaw od rampy aż po fakturę.</p>
        </article>
        <article className="guest">
          <div className="guest-photo">
            <img src="/assets/ph2-rusinek.png" alt="Zbigniew Rusinek" style={{ objectPosition: "center 35%" }} />
          </div>
          <h3>Zbigniew Rusinek</h3>
          <p className="role">Moderator spotkania</p>
          <div className="rule"><img src="/assets/line-rule.99be3ec4.svg" alt="" /></div>
          <p className="bio">Ekspert w obszarze standaryzacji, identyfikacji i automatyzacji procesów w przemyśle i logistyce. Łączy wiedzę technologiczną z praktycznym podejściem do wdrożeń, wspierając firmy w transformacji cyfrowej i zwiększaniu przejrzystości łańcuchów dostaw.</p>
        </article>
      </div>
    </section>
  );
}
