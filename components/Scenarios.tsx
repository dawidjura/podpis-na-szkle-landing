/* eslint-disable @next/next/no-img-element */
export default function Scenarios() {
  return (
    <section className="sec-scenarios" aria-labelledby="scenarios-title">
      <div className="scenarios-inner">
        <div className="scenarios-intro">
          <h2 id="scenarios-title">Praktyczna formuła spotkania</h2>
          <p className="sub">
            30 min wprowadzenia eksperckiego + 30 min dyskusji o realnych
            scenariuszach w logistyce:
          </p>
        </div>
        <div className="scenario-cols">
          <div className="scenario-col">
            <h3>Reklamacje – Uszkodzenia i braki</h3>
            <ul>
              <li>uszkodzenia towaru wykryte przy dostawie</li>
              <li>niekompletne dostawy</li>
              <li>spory z odbiorcami przeciągające się tygodniami</li>
            </ul>
          </div>
          <div className="scenario-col">
            <h3>Dokumentacja – Papier vs Cyfra</h3>
            <ul>
              <li>zagubione listy przewozowe i dokumenty WZ</li>
              <li>nieczytelne podpisy odbioru</li>
              <li>opóźnienia w fakturowaniu przez brak dokumentów</li>
            </ul>
          </div>
          <div className="scenario-col">
            <h3>Komunikacja – Dowody i Metadane</h3>
            <ul>
              <li>zdjęcia szkód przesyłane przez komunikatory</li>
              <li>brak dokładnego czasu zdarzenia (timestamp)</li>
              <li>brak lokalizacji zdarzenia (geolokalizacja)</li>
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}
