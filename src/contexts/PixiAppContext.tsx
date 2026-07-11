import { createContext, useContext, useEffect, useRef, useState, type ReactNode } from "react";
import { Application } from "pixi.js";
import { css } from "#styled-system/css";
import { GAME_W, GAME_H } from "../hooks/gameConstants";

const PixiAppContext = createContext<Application | null>(null);

export function PixiAppProvider({ children }: { children: ReactNode }) {
  const [app, setApp] = useState<Application | null>(null);
  const [initError, setInitError] = useState<Error | null>(null);
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
      })
      .catch((error: unknown) => {
        if (cancelled) return;
        const err = error instanceof Error ? error : new Error(String(error));
        // WebGL 非対応やコンテキスト生成失敗など。握りつぶすと画面が永遠に空白になるため surface する。
        console.error("Failed to initialize PixiJS application", err);
        setInitError(err);
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
      {initError ? (
        <div
          role="alert"
          className={css({
            position: "absolute",
            inset: 0,
            zIndex: 100,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            gap: "16px",
            padding: "48px",
            textAlign: "center",
            background: "#2a1a2a",
            color: "#f5e0f0",
          })}
        >
          <p className={css({ fontSize: "32px", fontWeight: "bold" })}>
            ゲーム画面の初期化に失敗しました
          </p>
          <p className={css({ fontSize: "24px" })}>{initError.message}</p>
        </div>
      ) : app ? (
        children
      ) : null}
    </PixiAppContext.Provider>
  );
}

// eslint-disable-next-line react-refresh/only-export-components
export function usePixiApp(): Application | null {
  return useContext(PixiAppContext);
}
