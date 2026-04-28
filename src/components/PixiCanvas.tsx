import { useEffect } from "react";
import { Graphics, Text, TextStyle, type Application } from "pixi.js";
import { usePixiApp } from "../contexts/PixiAppContext";

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
  commands: DrawCommand[];
  backgroundColor?: number;
}

export default function PixiCanvas({ commands, backgroundColor = 0xfff8e1 }: PixiCanvasProps) {
  const app = usePixiApp();

  useEffect(() => {
    if (!app) return;
    draw(app, commands, backgroundColor);
  }, [app, commands, backgroundColor]);

  // キャンバス自体は PixiAppProvider が固定位置でレンダリング済み
  return null;
}

function draw(app: Application, commands: DrawCommand[], backgroundColor: number) {
  app.renderer.background.color = backgroundColor;
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
