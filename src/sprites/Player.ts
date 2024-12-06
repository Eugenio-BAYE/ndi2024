import Phaser from 'phaser';

import { key } from '../constants';

enum Animation {
  Left = 'player_left',
  Right = 'player_right',
  Up = 'player_up',
  Down = 'player_down',
}

export interface PlayerState {
  food: number;
  energy: number;
  social: number;
  cleanliness: number;
  mood: number;
  health: number;
}

type Cursors = Record<
  'w' | 'a' | 's' | 'd' | 'up' | 'left' | 'down' | 'right' | 'space',
  Phaser.Input.Keyboard.Key
>;

const Velocity = {
  Horizontal: 175,
  Vertical: 175,
} as const;

export class Player extends Phaser.Physics.Arcade.Sprite {
  body!: Phaser.Physics.Arcade.Body;
  cursors: Cursors;
  selector: Phaser.Physics.Arcade.StaticBody;
  playerState: PlayerState;
  label!: Phaser.GameObjects.Text; // Propriété pour le texte
  labelBackground!: Phaser.GameObjects.Rectangle; // Propriété pour le fond du texte
  private labelVelocity = { x: 0, y: 0 };

  constructor(
    scene: Phaser.Scene,
    x: number,
    y: number,
    texture = key.atlas.player,
    frame = 'misa-front',
  ) {
    super(scene, x, y, texture, frame);

    // Add the sprite to the scene
    scene.add.existing(this);

    // Enable physics for the sprite
    scene.physics.world.enable(this);

    // The image has a bit of whitespace so use setSize and
    // setOffset to control the size of the player's body
    this.setSize(32, 42).setOffset(0, 22);

    // Collide the sprite body with the world boundary
    this.setCollideWorldBounds(true);

    // Set the camera to follow the game object
    scene.cameras.main.startFollow(this);
    scene.cameras.main.setZoom(1);

    // Add cursor keys
    this.cursors = this.createCursorKeys();

    // Create sprite animations
    this.createAnimations();

    this.createLabel(scene);

    // Add selector
    this.selector = scene.physics.add.staticBody(x - 8, y + 32, 16, 16);

    // Set player state
    this.playerState = {
      food: 60,
      energy: 50,
      social: 30,
      cleanliness: 100,
      mood: 90,
      health: 80,
    };
  }

  /**
   * Track the arrow keys & WASD.
   */
  private createCursorKeys() {
    return this.scene.input.keyboard!.addKeys(
      'w,a,s,d,up,left,down,right,space',
    ) as Cursors;
  }

  private createAnimations() {
    const anims = this.scene.anims;

    // Create left animation
    if (!anims.exists(Animation.Left)) {
      anims.create({
        key: Animation.Left,
        frames: anims.generateFrameNames(key.atlas.player, {
          prefix: 'misa-left-walk.',
          start: 0,
          end: 3,
          zeroPad: 3,
        }),
        frameRate: 10,
        repeat: -1,
      });
    }

    // Create right animation
    if (!anims.exists(Animation.Right)) {
      anims.create({
        key: Animation.Right,
        frames: anims.generateFrameNames(key.atlas.player, {
          prefix: 'misa-right-walk.',
          start: 0,
          end: 3,
          zeroPad: 3,
        }),
        frameRate: 10,
        repeat: -1,
      });
    }

    // Create up animation
    if (!anims.exists(Animation.Up)) {
      anims.create({
        key: Animation.Up,
        frames: anims.generateFrameNames(key.atlas.player, {
          prefix: 'misa-back-walk.',
          start: 0,
          end: 3,
          zeroPad: 3,
        }),
        frameRate: 10,
        repeat: -1,
      });
    }

    // Create down animation
    if (!anims.exists(Animation.Down)) {
      anims.create({
        key: Animation.Down,
        frames: anims.generateFrameNames(key.atlas.player, {
          prefix: 'misa-front-walk.',
          start: 0,
          end: 3,
          zeroPad: 3,
        }),
        frameRate: 10,
        repeat: -1,
      });
    }
  }

  private moveSelector(animation: Animation) {
    const { body, selector } = this;

    switch (animation) {
      case Animation.Left:
        selector.x = body.x - 19;
        selector.y = body.y + 14;
        break;

      case Animation.Right:
        selector.x = body.x + 35;
        selector.y = body.y + 14;
        break;

      case Animation.Up:
        selector.x = body.x + 8;
        selector.y = body.y - 18;
        break;

      case Animation.Down:
        selector.x = body.x + 8;
        selector.y = body.y + 46;
        break;
    }
  }

  update() {
    const { anims, body, cursors } = this;
    const prevVelocity = body.velocity.clone();

    this.updateLabelPosition();

    // Stop any previous movement from the last frame
    body.setVelocity(0);

    // Horizontal movement
    switch (true) {
      case cursors.left.isDown:
      case cursors.a.isDown:
        body.setVelocityX(-Velocity.Horizontal);
        break;

      case cursors.right.isDown:
      case cursors.d.isDown:
        body.setVelocityX(Velocity.Horizontal);
        break;
    }

    // Vertical movement
    switch (true) {
      case cursors.up.isDown:
      case cursors.w.isDown:
        body.setVelocityY(-Velocity.Vertical);
        break;

      case cursors.down.isDown:
      case cursors.s.isDown:
        body.setVelocityY(Velocity.Vertical);
        break;
    }

    // Normalize and scale the velocity so that player can't move faster along a diagonal
    body.velocity.normalize().scale(Velocity.Horizontal);

    // Update the animation last and give left/right animations precedence over up/down animations
    switch (true) {
      case cursors.left.isDown:
      case cursors.a.isDown:
        anims.play(Animation.Left, true);
        this.moveSelector(Animation.Left);
        break;

      case cursors.right.isDown:
      case cursors.d.isDown:
        anims.play(Animation.Right, true);
        this.moveSelector(Animation.Right);
        break;

      case cursors.up.isDown:
      case cursors.w.isDown:
        anims.play(Animation.Up, true);
        this.moveSelector(Animation.Up);
        break;

      case cursors.down.isDown:
      case cursors.s.isDown:
        anims.play(Animation.Down, true);
        this.moveSelector(Animation.Down);
        break;

      default:
        anims.stop();

        // If we were moving, pick an idle frame to use
        switch (true) {
          case prevVelocity.x < 0:
            this.setTexture(key.atlas.player, 'misa-left');
            this.moveSelector(Animation.Left);
            break;

          case prevVelocity.x > 0:
            this.setTexture(key.atlas.player, 'misa-right');
            this.moveSelector(Animation.Right);
            break;

          case prevVelocity.y < 0:
            this.setTexture(key.atlas.player, 'misa-back');
            this.moveSelector(Animation.Up);
            break;

          case prevVelocity.y > 0:
            this.setTexture(key.atlas.player, 'misa-front');
            this.moveSelector(Animation.Down);
            break;
        }
    }
  }

  /*
   * Player actions
   */

  // Player action: sleep
  public sleep() {
    this.updateStateEnergy(50);
  }

  // Player action: sleep outside
  public sleepOutside() {
    this.updateStateEnergy(50);
    this.updateStateCleanliness(-20);
  }

  // Player action: do sports
  public doSports() {
    this.updateStateHealth(30);
    this.updateStateCleanliness(-20);
    this.updateStateEnergy(-20);
    this.updateStateFood(-20);
  }

  // Player action: work
  public work() {
    this.updateStateSocial(10);
    this.updateStateEnergy(-40);
    this.updateStateMood(-20);
  }

  // Player action: drink beer
  public drinkBeer() {
    this.updateStateSocial(15);
    this.updateStateMood(20);
    this.updateStateHealth(-10);
  }

  // Player action: hangover
  public hangover() {
    this.updateStateMood(-40);
    this.updateStateEnergy(-40);
    this.updateStateHealth(-40);
    this.updateStateSocial(-40);
    this.updateStateFood(-40);
    this.updateStateCleanliness(-40);
  }

  // Player action: play darts
  public playDarts() {
    this.updateStateSocial(10);
    this.updateStateMood(5);
  }

  // Player action: smoke
  public smoke() {
    this.updateStateSocial(10);
    this.updateStateMood(5);
    this.updateStateHealth(-20);
  }

  // Player action: read
  public read() {
    this.updateStateHealth(5);
    this.updateStateMood(10);
  }

  // Player action: play games
  public playGames() {
    this.updateStateMood(20);
    this.updateStateCleanliness(-30);
  }

  // Player action: eat healthy
  public eatHealthy() {
    this.updateStateFood(20);
  }

  // Player action: eat unhealthy
  public eatUnhealthy() {
    this.updateStateFood(30);
    this.updateStateHealth(-20);
  }

  // Player action: stay at home too much
  public stayAtHomeTooMuch() {
    this.updateStateSocial(-20);
    this.updateStateMood(-15);
    this.updateStateCleanliness(-30);
  }

  // Player action: clean the house
  public cleanHouse() {
    this.updateStateCleanliness(20);
    this.updateStateEnergy(-15);
  }

  // Player action: take a shower
  public takeShower() {
    this.updateStateCleanliness(20);
    this.updateStateEnergy(-15);
  }

  private updateStateFood(increment: number) {
    this.playerState.food = Math.min(100, this.playerState.food + increment);
  }

  private updateStateSocial(increment: number) {
    this.playerState.social = Math.min(
      100,
      this.playerState.social + increment,
    );
  }

  private updateStateEnergy(increment: number) {
    this.playerState.energy = Math.min(
      100,
      this.playerState.energy + increment,
    );
  }

  private updateStateCleanliness(increment: number) {
    this.playerState.cleanliness = Math.min(
      100,
      this.playerState.cleanliness + increment,
    );
  }

  private updateStateMood(increment: number) {
    this.playerState.mood = Math.min(100, this.playerState.mood + increment);
  }

  private updateStateHealth(increment: number) {
    this.playerState.health = Math.min(
      100,
      this.playerState.health + increment,
    );
  }

  private createLabel(scene: Phaser.Scene) {
    const offsetY = -20; // Décalage vertical au-dessus de la tête

    // Crée un rectangle de fond pour le texte
    this.labelBackground = scene.add.rectangle(
      this.x,
      this.y + offsetY,
      50, // Largeur initiale
      20, // Hauteur initiale
      0x000000, // Couleur noire
      0.5, // Transparence
    );
    this.labelBackground.setOrigin(0.5, 0.5); // Origine centrée

    // Crée le texte
    this.label = scene.add.text(this.x, this.y + offsetY, 'Hello!', {
      fontSize: '12px',
      color: '#ffffff',
      align: 'center',
      fontStyle: 'bold',
    });
    this.label.setOrigin(0.5, 0.5); // Origine centrée

    // Masque l'étiquette par défaut
    this.setLabelVisible(false);
  }

  /**
   * Met à jour la position du texte et du fond au-dessus du sprite.
   */
  private updateLabelPosition() {
    const offsetY = -20; // Décalage vertical
    const targetX = this.x;
    const targetY = this.y + offsetY;

    const smoothSpeed = 0.2; // Valeur réduite pour un mouvement plus réactif sans orbite

    // Mise à jour directe mais lisse de la position du texte
    this.label.x += (targetX - this.label.x) * smoothSpeed;
    this.label.y += (targetY - this.label.y) * smoothSpeed;

    this.labelBackground.x = this.label.x;
    this.labelBackground.y = this.label.y;
  }

  /**
   * Change le texte au-dessus de la tête.
   */
  public setLabelText(newText: string, bold: boolean = false) {
    // Met à jour le texte
    this.label.setText(newText);

    // Ajuste le style si nécessaire
    this.label.setStyle({ fontStyle: bold ? 'bold' : 'normal' });

    // Calcule la largeur du rectangle avec un padding
    const padding = 10; // Espace supplémentaire autour du texte
    this.labelBackground.width = this.label.width + padding;

    // Centre l'origine du texte et du rectangle
    this.label.setOrigin(0.5, 0.5); // Centre le texte
    this.labelBackground.setOrigin(0.5, 0.5); // Centre le rectangle
  }

  public getLabelText() {
    return this.label.text;
  }
  /**
   * Rend l'étiquette visible ou invisible.
   */
  public setLabelVisible(visible: boolean) {
    this.label.setVisible(visible);
    this.labelBackground.setVisible(visible);
  }

  public getLabelVisible(): boolean {
    return this.label.visible;
  }

  /**
   * Détruit complètement l'étiquette (texte et fond).
   */
  public destroyLabel() {
    this.label.destroy();
    this.labelBackground.destroy();
  }
}
