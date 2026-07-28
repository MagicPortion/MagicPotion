import { useEffect } from "react";
import { Assets, Graphics, Text, TextStyle, Sprite, type Application, type Texture } from "pixi.js";
import { usePixiApp } from "../contexts/PixiAppContext";

export interface DrawCommand {
  type: "rect" | "circle" | "text" | "image";
  x: number;
  y: number;
  width?: number;
  height?: number;
  radius?: number;
  color?: number;
  text?: string;
  fontSize?: number;
  textColor?: string;
  imageSrc?: string;
  scaleX?: number;
}

interface PixiCanvasProps {
  commands: DrawCommand[];
  backgroundColor?: number;
}

export default function PixiCanvas({ commands, backgroundColor = 0xfff8e1 }: PixiCanvasProps) {
  const app = usePixiApp();

  useEffect(() => {
    if (!app) return;

    let active = true;
    void draw(app, commands, backgroundColor, () => active);

    return () => {
      active = false;
    };
  }, [app, commands, backgroundColor]);

  // キャンバス自体は PixiAppProvider が固定位置でレンダリング済み
  return null;
}

async function draw(
  app: Application,
  commands: DrawCommand[],
  backgroundColor: number,
  isActive: () => boolean,
) {
  const imageSources = [
    ...new Set(
      commands
        .filter((cmd) => cmd.type === "image" && cmd.imageSrc)
        .map((cmd) => cmd.imageSrc as string),
    ),
  ];
  const textures = new Map<string, Texture>();

  // 画像背景の読み込み中に、レンダラーの仮背景色を見せない
  app.renderer.background.alpha = imageSources.length > 0 ? 0 : 1;

  await Promise.all(
    imageSources.map(async (src) => {
      const texture = await Assets.load<Texture>(src);
      textures.set(src, texture);
    }),
  );

  // シーンが切り替わった後に、古い非同期描画で上書きしない
  if (!isActive()) return;

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
    } else if (cmd.type === "image") {
      if (cmd.imageSrc) {
        const texture = textures.get(cmd.imageSrc);
        if (!texture) continue;
        const sprite = new Sprite(texture);
        sprite.x = cmd.x;
        sprite.y = cmd.y;
        if (cmd.width && cmd.height) {
          sprite.width = cmd.width;
          sprite.height = cmd.height;
        }
        if (cmd.scaleX !== undefined) {
          sprite.scale.x = cmd.scaleX;
        }
        app.stage.addChild(sprite);
      }
    }
  }
}
