interface PlaceholderProps {
  label?: string;
  tint?: [string, string];
  rounded?: boolean;
  className?: string;
}

/* Sized grey fallback shown when an image slot has no file yet. */
export default function Placeholder({ label, tint, rounded, className = '' }: PlaceholderProps) {
  const [a, b] = tint ?? ['#E5DBC6', '#C6A36A'];
  return (
    <div
      className={`relative grid h-full w-full place-items-center overflow-hidden ${
        rounded ? 'rounded-full' : ''
      } ${className}`}
      style={{ background: `linear-gradient(135deg, ${a}, ${b})` }}
    >
      <div className="grain-layer absolute inset-0 opacity-[0.18] mix-blend-overlay" />
      {label && (
        <span className="eyebrow relative z-10 text-noir/55">{label}</span>
      )}
    </div>
  );
}
