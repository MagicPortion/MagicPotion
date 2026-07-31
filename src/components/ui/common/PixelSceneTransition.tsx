import type { CSSProperties } from "react";

const COLUMNS = 20;
const ROWS = 12;

interface PixelSceneTransitionProps {
  phase: "cover" | "uncover";
}

type PixelStyle = CSSProperties & {
  "--pixel-delay": string;
};

export default function PixelSceneTransition({ phase }: PixelSceneTransitionProps) {
  return (
    <div
      className={`pixel-scene-transition pixel-scene-transition--${phase}`}
      aria-hidden="true"
    >
      {Array.from({ length: COLUMNS * ROWS }, (_, index) => {
        const column = index % COLUMNS;
        const row = Math.floor(index / COLUMNS);
        // 右から左へ進みつつ、行ごとに少しだけ時差を付けてドット感を出す。
        const delay = (COLUMNS - 1 - column) * 18 + ((row * 3) % 5) * 10;

        return (
          <span
            key={index}
            className="pixel-scene-transition__cube"
            style={{ "--pixel-delay": `${delay}ms` } as PixelStyle}
          />
        );
      })}
    </div>
  );
}
