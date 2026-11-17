// Small 3x3 pixel loader. Dots light up in a diagonal wave; color follows `currentColor`.
const ORDER = [0, 1, 2, 1, 2, 3, 2, 3, 4];

export function PixelLoader({ className = "", label = "Loading" }: { className?: string; label?: string }) {
  return (
    <span role="status" aria-label={label} className={`pixel-loader ${className}`}>
      {ORDER.map((i, k) => (
        <span key={k} style={{ "--i": i } as React.CSSProperties} />
      ))}
    </span>
  );
}
