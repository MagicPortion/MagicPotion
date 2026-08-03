絵文字は使わずにsvgを使うこと（src/components/ui/icons/ にまとめる）
型は`any`などで逃げないこと。
cssはpandacssを使うこと。styleは基本使わない。stylesを使う場合は必ず理由を述べて
シーン（scenes/）はPixiCanvasとUIコンポーネントの組み合わせのみ。シーンにUIを直接書かないこと。
UIコンポーネントはsrc/components/ui/ 以下にディレクトリを分けて配置すること（shop/, brew/, recipe/, display/, dialogue/ など）

レスポンシブデザインはやらないでください。1920x1080固定で

文字の大きさは30px以上。16pxの文字は見えないと思ってください。小さくても24px以上で。

## 動作確認（Playwright等での検証）のやり方

`src/store/useGameStore.ts` の末尾で、開発モード時に `window.useGameStore` へzustandストアを公開している。
特定のシーン・状態を確認したいときは、タイトル→導入→レシピ選択→ショップ→…とUIを毎回クリックして辿らず、
このストアを直接操作して目的の状態にジャンプすること。

```js
// 例: 素材を持たせた状態でBrewシーンに直接遷移する
await page.evaluate(() => {
  window.useGameStore.setState({
    scene: "brew",
    materials: { holy_water: 5, dragon_tail: 5 },
  });
});

// 例: brew()を直接呼んで結果ポップアップの見た目だけ確認する
await page.evaluate(() => {
  const store = window.useGameStore;
  store.getState().brew("holy_water", "dragon_tail");
});
```

`setState`は差分マージ（既存のmoney/dayなどは保持される）。`scene`と必要なフィールドだけ渡せばよい。
ポップアップ表示などコンポーネントローカルなstate（BrewSceneの調合アニメーション等）はストア操作だけでは開かないため、
そこだけは実際にクリックする（ただしショップ〜ブリューまでの移動はストア操作で省略できる）。