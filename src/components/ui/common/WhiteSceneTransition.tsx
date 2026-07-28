interface WhiteSceneTransitionProps {
  phase: "cover" | "uncover";
}

export default function WhiteSceneTransition({ phase }: WhiteSceneTransitionProps) {
  return (
    <div
      className={`white-scene-transition white-scene-transition--${phase}`}
      aria-hidden="true"
    />
  );
}
