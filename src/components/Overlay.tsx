import { Rectangle, useScene } from 'phaser-jsx';

export function Overlay({ alpha = 0.5 }: { alpha?: number }) {
  const scene = useScene();
  const { width, height } = scene.cameras.main;

  return (
    <Rectangle
      width={width * 2}
      height={height * 2}
      fillColor={0x000000}
      alpha={alpha}
      scrollFactorX={0}
      scrollFactorY={0}
    />
  );
}
