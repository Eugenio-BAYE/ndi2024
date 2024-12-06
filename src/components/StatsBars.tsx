import { useScene } from 'phaser-jsx';

import { Bar } from './Bar';

export interface PlayerState {
  food: number;
  energy: number;
  social: number;
  cleanliness: number;
  mood: number;
  health: number;
}

/**
 * Textbox that has a "fixed" position on the screen.
 */
export function StatsBars(props: PlayerState) {
  const scene = useScene();
  const { width } = scene.cameras.main;

  return (
    <>
      <Bar x={width - 100} y={25} level={props.health} color={0xff0000} />
      <Bar x={width - 100} y={50} level={props.energy} color={0xffff00} />
      <Bar x={width - 100} y={75} level={props.food} color={0x00ff00} />
      <Bar x={width - 100} y={100} level={props.social} color={0xff00ff} />
      <Bar x={width - 100} y={125} level={props.cleanliness} color={0x00ffff} />
      <Bar x={width - 100} y={150} level={props.mood} color={0xff8000} />
    </>
  );
}
