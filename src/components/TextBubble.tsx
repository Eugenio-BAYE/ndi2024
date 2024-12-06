import type Phaser from 'phaser';
import { createRef, Rectangle, Text } from 'phaser-jsx';

interface Props {
  children: string;
  x?: number;
  y?: number;
}

export function TextBubble(props: Props) {
  const { children, ...textProps } = props;
  const ref = createRef<Phaser.GameObjects.Text>();

  return (
    <>
      <Rectangle
        height={150}
        width={300}
        x={props.x}
        y={props.y}
        fillColor={0xffffff}
        strokeColor={0x000000}
        isStroked={true}
        lineWidth={4}
      ></Rectangle>
      <Text
        {...textProps}
        input={{ cursor: 'pointer' }}
        originX={0.65}
        originY={1.5}
        ref={ref}
        style={{
          color: '#000',
          fontFamily: 'monospace',
          fontSize: '18px',
        }}
        text={children}
      />
    </>
  );
}
