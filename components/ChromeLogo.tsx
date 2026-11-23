// QuietLead mark in liquid chrome: the letters (from /brand/ql-mark.png, used as a mask) are
// filled with a polished-metal gradient whose highlights slowly roll across, plus a soft blue
// glow. Purely decorative; pair it with a text label or aria-label on the parent.
export function ChromeLogo({ size = 32, className = "" }: { size?: number; className?: string }) {
  return (
    <span aria-hidden="true" className={`chrome-logo-wrap inline-block shrink-0 ${className}`} style={{ width: size, height: size }}>
      <span className="chrome-logo block h-full w-full" />
    </span>
  );
}
