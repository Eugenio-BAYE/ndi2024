import { Rectangle } from 'phaser-jsx';

import { Depth } from '../constants';

export interface BarProps {
  level: number;
  color: number;
  x: number;
  y: number;
}

/**
 * Textbox that has a "fixed" position on the screen.
 */
export function Bar(props: BarProps) {
  return (
    <>
      <Rectangle
        x={props.x}
        y={props.y}
        height={20}
        width={150}
        fillColor={0xffffff}
        strokeColor={0x000000}
        isStroked={true}
        lineWidth={3}
        alpha={1}
        scrollFactorX={0}
        scrollFactorY={0}
        depth={Depth.AboveWorld}
      />
      <Rectangle
        x={props.x - 75 + (150 * props.level) / 200}
        y={props.y}
        height={20}
        width={(150 * props.level) / 100}
        fillColor={props.color}
        strokeColor={0x000000}
        isStroked={true}
        lineWidth={3}
        alpha={1}
        scrollFactorX={0}
        scrollFactorY={0}
        depth={Depth.AboveWorld}
      />
    </>
  );
}
