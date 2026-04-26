export default function IconDiamond({ size = 12 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 12 12" fill="currentColor" aria-hidden="true">
      <polygon points="6,1 11,6 6,11 1,6" />
    </svg>
  );
}
