# Sound Effects

外部からダウンロードしたSE音源は、このディレクトリに置きます。

推奨形式:

- `ogg`: 軽量でWeb向き
- `mp3`: 対応範囲が広い
- `wav`: 短い効果音や編集中の素材向き

命名ルール:

- 半角英数字とハイフンを使う
- 役割が分かる名前にする
- 例: `button-click.ogg`, `brew-success.mp3`, `coin-drop.wav`

Vite の `base` が `/MagicPotion/` のため、コードから参照するときは次のパスを使います。

```ts
const se = new Audio("/MagicPotion/assets/se/button-click.ogg");
```
