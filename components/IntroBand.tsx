const BENEFITS = [
  { value: "50%", label: "krótszy DSO" },
  { value: "100%", label: "dostępności dokumentacji" },
  { value: "0%", label: "zagubionych dokumentów" },
] as const;

export default function IntroBand() {
  return (
    <section
      className="sec-intro-band"
      id="korzysci"
      aria-labelledby="intro-band-title"
    >
      <div className="intro-band-inner">
        <h2 id="intro-band-title" className="band-title">
          Korzyści cyfrowego dowodu dostawy
        </h2>
        <div className="intro-band-stats">
          {BENEFITS.map(({ value, label }) => (
            <div key={value} className="intro-band-stat">
              <p className="intro-band-stat-label">
                <span className="intro-band-stat-num">{value}</span> {label}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
