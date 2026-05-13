/* eslint-disable @next/next/no-img-element */
export default function Organizers() {
  return (
    <section className="sec-organizers" id="organizatorzy" aria-labelledby="org-title">
      <div className="organizers-inner">
        <h2 id="org-title">Organizatorzy</h2>
        <div className="organizers-grid">
          <article className="organizer-card">
            <div className="organizer-logo organizer-logo--gs1">
              <img src="/assets/gs1-logo.png" alt="GS1 Polska" width={200} height={80} />
            </div>
            <p>
              GS1 Polska jest częścią globalnej organizacji GS1, która rozwija jeden z najpowszechniej
              wykorzystywanych systemów standardów na świecie. Standardy GS1 wspierają firmy i organizacje w
              identyfikacji, gromadzeniu oraz wymianie danych w procesach biznesowych i logistycznych.
            </p>
            <p>
              Wspólny standard danych tworzy uniwersalny język GS1, stanowiący fundament wielu systemów i
              procesów funkcjonujących na całym świecie. Dzięki temu organizacje mogą działać sprawniej,
              bezpieczniej i w bardziej zrównoważony sposób.
            </p>
          </article>
          <article className="organizer-card">
            <div
              className="organizer-logo organizer-logo--euvic"
              role="img"
              aria-label="Euvic"
            />
            <p>
              Euvic to międzynarodowa grupa technologiczna z ponad 20-letnim doświadczeniem m.in. w branży
              logistycznej, produkcyjnej czy handlowej. Pomagamy organizacjom integrować systemy ERP, WMS i TMS,
              automatyzować przepływ danych oraz zwiększać przejrzystość i efektywność operacji -
              przekształcając tradycyjne łańcuchy dostaw w przewidywalne, zautomatyzowane środowiska oparte na
              danych.
            </p>
            <p>
              Łączymy kompetencje w obszarze software development, consultingu i transformacji cyfrowej,
              tworząc bezpieczne ekosystemy, które integrują działy, magazyny, klientów i partnerów 3PL w jeden
              spójny ekosystem.
            </p>
          </article>
        </div>
      </div>
    </section>
  );
}
