import { createContext, useContext, useEffect, useRef, useState, type ReactNode } from "react";
import { Application } from "pixi.js";

const PixiAppContext = createContext<Application | null>(null);

export function PixiAppProvider({ children }: { children: ReactNode }) {
  const [app, setApp] = useState<Application | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  // init 完了済みアプリを追跡（cleanup が init より先に走る StrictMode 対策）
  const readyRef = useRef<Application | null>(null);

  useEffect(() => {
    const pixiApp = new Application();
    let cancelled = false;

    pixiApp
      .init({ resizeTo: window, background: 0xfff0f5, antialias: true })
      .then(() => {
        if (cancelled) {
          // cleanup が先に走った場合：init 完了後に安全に destroy
          pixiApp.destroy(true);
          return;
        }
        readyRef.current = pixiApp;
        containerRef.current?.appendChild(pixiApp.canvas as HTMLCanvasElement);
        setApp(pixiApp);
      });

    return () => {
      cancelled = true;
      // init 完了済みの場合のみ destroy（未完了なら then() 側で処理）
      if (readyRef.current) {
        readyRef.current.destroy(true);
        readyRef.current = null;
      }
      setApp(null);
    };
  }, []);

  return (
    <PixiAppContext.Provider value={app}>
      {/* キャンバスは常にフルスクリーンで最背面に固定 */}
      <div
        ref={containerRef}
        style={{ position: "fixed", inset: 0, zIndex: 0, pointerEvents: "none" }}
      />
      {app ? children : null}
    </PixiAppContext.Provider>
  );
}

// eslint-disable-next-line react-refresh/only-export-components
export function usePixiApp(): Application | null {
  return useContext(PixiAppContext);
}
