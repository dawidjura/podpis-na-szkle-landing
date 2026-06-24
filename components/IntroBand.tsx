const BENEFITS = [
  { value: "50%", label: "krótszy DSO" },
  { value: "90%", label: "niższe koszty obsługi" },
  { value: "97%", label: "dokładności zamówień" },
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
            <div key={label} className="intro-band-stat">
              <p className="intro-band-stat-label">
                <span className="intro-band-stat-num">{value}</span>
                <span className="intro-band-stat-desc">{label}</span>
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
