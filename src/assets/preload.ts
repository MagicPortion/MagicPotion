import witchImage from "./characters/witch.png";
import shopkeeperImage from "./characters/shopkeeper.png";
import witchCoatImage from "./characters/witch-coat.png";
import witchEndImage from "./characters/witch-end.png";

// 立ち絵は店シーンに辿り着くまでの会話中に表示されるため最優先でプリロードする
export const CHARACTER_PORTRAITS: string[] = [
  witchImage,
  shopkeeperImage,
  witchCoatImage,
  witchEndImage,
];

// アイテム画像は店シーンに着くまで表示されないため後回しでプリロードする
const itemModules = import.meta.glob<string>("./items/*.png", {
  eager: true,
  import: "default",
});
export const ITEM_IMAGES: string[] = Object.values(itemModules);
