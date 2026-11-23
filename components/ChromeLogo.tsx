// QuietLead app icon in dark liquid glass: a glossy black tile, an iridescent rim that slowly
// travels around the edge (with a soft halo), a top gloss, and the white QL glyph with thin
// cyan/magenta fringes like light split by glass. Pure CSS; decorative (label the parent).
export function ChromeLogo({ size = 32, className = "" }: { size?: number; className?: string }) {
  return (
    <span
      aria-hidden="true"
      className={`lg-icon ${className}`}
      style={{ width: size, height: size, ["--s" as string]: `${size}px` }}
    >
      <span className="lg-glow" />
      <span className="lg-rim" />
      <span className="lg-gloss" />
      <span className="lg-glyph lg-glyph-c" />
      <span className="lg-glyph lg-glyph-m" />
      <span className="lg-glyph" />
    </span>
  );
}
