// Endless text marquee: the list is rendered twice and the track slides by exactly half its
// width, so the loop has no seam. Pure CSS; pauses on hover, stops with reduced motion.
export function Marquee({ items, className = "" }: { items: string[]; className?: string }) {
  const row = (hidden: boolean) => (
    <ul aria-hidden={hidden || undefined} className="flex shrink-0 items-center">
      {items.map((item) => (
        <li key={item} className="flex items-center">
          <span className="px-6 whitespace-nowrap sm:px-10">{item}</span>
          <span aria-hidden="true" className="h-1.5 w-1.5 shrink-0 rounded-full bg-current opacity-40" />
        </li>
      ))}
    </ul>
  );
  return (
    <div className={`marquee group overflow-hidden ${className}`}>
      <div className="marquee-track flex w-max group-hover:[animation-play-state:paused]">
        {row(false)}
        {row(true)}
      </div>
    </div>
  );
}
