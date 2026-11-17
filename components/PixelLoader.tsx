// Live loader: three dots that bounce in a wave; color follows `currentColor`.
// (File name kept for existing imports.)
export function PixelLoader({ className = "", label = "Loading" }: { className?: string; label?: string }) {
  return (
    <span role="status" aria-label={label} className={`dots-loader ${className}`}>
      <span />
      <span />
      <span />
    </span>
  );
}
