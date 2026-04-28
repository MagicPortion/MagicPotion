export default function IconCoin({ size = 16 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <circle cx="12" cy="12" r="9" />
      <path d="M14.5 9a2.5 2.5 0 0 0-5 0c0 1.4 1 2 2.5 2.5S14.5 13 14.5 14.5a2.5 2.5 0 0 1-5 0" />
      <line x1="12" y1="7" x2="12" y2="6" />
      <line x1="12" y1="18" x2="12" y2="17" />
    </svg>
  );
}
