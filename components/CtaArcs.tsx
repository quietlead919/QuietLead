// Stacked glass bands rising in from both lower corners (the "light arcs" look): nested,
// rounded slabs with glowing rims, each a little further in. Purely decorative.
const BANDS = [0, 1, 2, 3, 4];

export function CtaArcs() {
  return (
    <div aria-hidden="true" className="pointer-events-none absolute inset-0 z-[-1] overflow-hidden">
      {(["left", "right"] as const).map((side) => (
        <div key={side} className={`cta-arcs cta-arcs-${side}`}>
          {BANDS.map((i) => (
            <span key={i} className="cta-band" style={{ "--i": i } as React.CSSProperties} />
          ))}
        </div>
      ))}
    </div>
  );
}
