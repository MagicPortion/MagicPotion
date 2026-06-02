絵文字は使わずにsvgを使うこと（src/components/ui/icons/ にまとめる）
型は`any`などで逃げないこと。
cssはpandacssを使うこと。styleは基本使わない。stylesを使う場合は必ず理由を述べて
シーン（scenes/）はPixiCanvasとUIコンポーネントの組み合わせのみ。シーンにUIを直接書かないこと。
UIコンポーネントはsrc/components/ui/ 以下にディレクトリを分けて配置すること（shop/, brew/, recipe/, display/, dialogue/ など）

レスポンシブデザインはやらないでください。1920x1080固定で

文字の大きさは30px以上。16pxの文字は見えないと思ってください。小さくても24px以上で。