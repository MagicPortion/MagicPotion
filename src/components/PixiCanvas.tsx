import { useRef, useEffect } from "react";
import { Application, Graphics, Text, TextStyle } from "pixi.js";

export interface DrawCommand {
  type: "rect" | "circle" | "text";
  x: number;
  y: number;
  width?: number;
  height?: number;
  radius?: number;
  color?: number;
  text?: string;
  fontSize?: number;
  textColor?: string;
}

interface PixiCanvasProps {
  width: number;
  height: number;
  commands: DrawCommand[];
  backgroundColor?: number;
  style?: React.CSSProperties;
}

export default function PixiCanvas({
  width,
  height,
  commands,
  backgroundColor = 0xfff8e1,
  style,
}: PixiCanvasProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const appRef = useRef<Application | null>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const app = new Application();
    let cancelled = false;

    app
      .init({ width, height, background: backgroundColor, antialias: true })
      .then(() => {
        if (cancelled) { app.destroy(true); return; }
        appRef.current = app;
        container.appendChild(app.canvas as HTMLCanvasElement);
        draw(app, commands);
      });

    return () => {
      cancelled = true;
      if (appRef.current) {
        appRef.current.destroy(true);
        appRef.current = null;
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [width, height]);

  useEffect(() => {
    if (appRef.current) draw(appRef.current, commands);
  }, [commands]);

  return (
    <div
      ref={containerRef}
      style={{ display: "block", lineHeight: 0, ...style }}
    />
  );
}

function draw(app: Application, commands: DrawCommand[]) {
  app.stage.removeChildren();
  for (const cmd of commands) {
    if (cmd.type === "rect") {
      const g = new Graphics();
      g.rect(cmd.x, cmd.y, cmd.width ?? 50, cmd.height ?? 50);
      g.fill(cmd.color ?? 0xffffff);
      app.stage.addChild(g);
    } else if (cmd.type === "circle") {
      const g = new Graphics();
      g.circle(cmd.x, cmd.y, cmd.radius ?? 20);
      g.fill(cmd.color ?? 0xffffff);
      app.stage.addChild(g);
    } else if (cmd.type === "text") {
      const style = new TextStyle({
        fontSize: cmd.fontSize ?? 16,
        fill: cmd.textColor ?? "#333",
        fontFamily: "system-ui, sans-serif",
      });
      const t = new Text({ text: cmd.text ?? "", style });
      t.x = cmd.x;
      t.y = cmd.y;
      app.stage.addChild(t);
    }
  }
}
