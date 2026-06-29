export default function IconMorning({ size = 16 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <circle cx="12" cy="13" r="6" />
      <path d="M12 1v3" />
      <path d="M4.22 4.22l2.12 2.12" />
      <path d="M1 12h3" />
      <path d="M4.22 19.78l2.12-2.12" />
    </svg>
  );
}
