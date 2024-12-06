import { Scene } from 'phaser';
import { render } from 'phaser-jsx';

import { Button, Overlay } from '../components';
import { TextBubble } from '../components/TextBubble';
import { key } from '../constants';

export class Dialog extends Scene {
  constructor() {
    super(key.scene.dialog);
  }

  static speakerName = '';
  static message = '';

  create() {
    this.input.keyboard!.on('keydown-ENTER', this.exit, this);
    const { centerX, centerY } = this.cameras.main;

    render(
      <>
        <Overlay alpha={0.35} />

        <TextBubble x={centerX} y={centerY}>
          {Dialog.speakerName + '\n' + Dialog.message}
        </TextBubble>

        <Button center fixed onClick={this.exit} x={centerX} y={centerY + 130}>
          Suivant
        </Button>
      </>,
      this,
    );
  }

  private exit() {
    this.scene.resume(key.scene.main);
    this.scene.stop();
  }
}
