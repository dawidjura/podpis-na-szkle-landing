/* eslint-disable @next/next/no-img-element */
export default function Audience() {
  return (
    <section className="sec-audience" id="dla-kogo" aria-labelledby="aud-title">
      <div className="audience-vector" aria-hidden="true"><img src="/assets/learn-vector.fc9cec0e.svg" alt="" /></div>
      <div className="audience-inner">
        <div className="audience-stack">
          <h2 id="aud-title">Dla kogo jest ten webinar?</h2>
          <div className="aud-cols">
            <div className="aud-col">
              <h3>Stanowiska i Funkcje:</h3>
              <ul>
                <li>Dyrektorzy i managerowie logistyki</li>
                <li>Managerowie transportu i dystrybucji</li>
                <li>Managerowie łańcucha dostaw</li>
                <li>Osoby odpowiedzialne za rozliczenia dostaw</li>
                <li>IT managerowie w firmach logistycznych i TSL</li>
              </ul>
            </div>
            <div className="aud-col">
              <h3>Ten&nbsp;webinar&nbsp;jest dla Ciebie, jeśli:</h3>
              <ul>
                <li>Masz dość&nbsp;sporów z odbiorcami o stan dostarczonego towaru.</li>
                <li>Ręcznie sprawdzasz statusy dostaw i czekasz na dokumenty do fakturowania.</li>
                <li>Szukasz sposobu na zabezpieczenie dowodów dostawy (zdjęcia, podpis na szkle) w jednym cyfrowym procesie.</li>
                <li>Chcesz połączyć&nbsp;standardy GS1 z cyfrowym potwierdzeniem dostawy.</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
