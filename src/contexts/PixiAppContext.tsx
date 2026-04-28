import { createContext, useContext, useEffect, useRef, useState, type ReactNode } from "react";
import { Application } from "pixi.js";
import { GAME_W, GAME_H } from "../hooks/gameConstants";

const PixiAppContext = createContext<Application | null>(null);

export function PixiAppProvider({ children }: { children: ReactNode }) {
  const [app, setApp] = useState<Application | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const readyRef = useRef<Application | null>(null);

  useEffect(() => {
    const pixiApp = new Application();
    let cancelled = false;

    pixiApp
      .init({ width: GAME_W, height: GAME_H, background: 0xfff0f5, antialias: true })
      .then(() => {
        if (cancelled) {
          pixiApp.destroy(true);
          return;
        }
        readyRef.current = pixiApp;
        containerRef.current?.appendChild(pixiApp.canvas as HTMLCanvasElement);
        setApp(pixiApp);
      });

    return () => {
      cancelled = true;
      if (readyRef.current) {
        readyRef.current.destroy(true);
        readyRef.current = null;
      }
      setApp(null);
    };
  }, []);

  return (
    <PixiAppContext.Provider value={app}>
      {/* キャンバスはゲームコンテナ内に position: absolute で配置 */}
      <div
        ref={containerRef}
        style={{ position: "absolute", inset: 0, zIndex: 0, pointerEvents: "none" }}
      />
      {app ? children : null}
    </PixiAppContext.Provider>
  );
}

// eslint-disable-next-line react-refresh/only-export-components
export function usePixiApp(): Application | null {
  return useContext(PixiAppContext);
}
