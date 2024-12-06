import { Scene } from 'phaser';
import { render } from 'phaser-jsx';

import { Button, Overlay } from '../components';
import { TextBubble } from '../components/TextBubble';
import { key } from '../constants';

export class ChoiceDialog extends Scene {
  constructor() {
    super(key.scene.choiceDialog);
  }

  static speakerName = '';
  static question = '';
  static firstChoice = '';
  static secondChoice = '';
  static firstChoiceCallback: () => void;
  static secondChoiceCallback: () => void;

  create() {
    this.input.keyboard!.on('keydown-ENTER', this.exit, this);
    const { centerX, centerY } = this.cameras.main;

    render(
      <>
        <Overlay alpha={0.35} />

        <TextBubble x={centerX} y={centerY}>
          {ChoiceDialog.speakerName + '\n' + ChoiceDialog.question}
        </TextBubble>

        <Button
          center
          fixed
          onClick={() => {
            ChoiceDialog.firstChoiceCallback();
            this.exit();
          }}
          x={centerX}
          y={centerY + 130}
        >
          {ChoiceDialog.firstChoice}
        </Button>

        <Button
          center
          fixed
          onClick={() => {
            ChoiceDialog.secondChoiceCallback();
            this.exit();
          }}
          x={centerX}
          y={centerY + 180}
        >
          {ChoiceDialog.secondChoice}
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
