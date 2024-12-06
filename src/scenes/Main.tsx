import Phaser from 'phaser';
import { render } from 'phaser-jsx';

import { TilemapDebug, Typewriter } from '../components';
import {
  Depth,
  key,
  TilemapLayer,
  TilemapObject,
  TILESET_NAME,
} from '../constants';
import { Player } from '../sprites';
import { state } from '../state';

interface Sign extends Phaser.Physics.Arcade.StaticBody {
  text?: string;
}

export class Main extends Phaser.Scene {
  private player!: Player;
  private sign!: Sign;
  private tilemap!: Phaser.Tilemaps.Tilemap;
  private worldLayer!: Phaser.Tilemaps.TilemapLayer;
  private zones: Zone[] = [];

  constructor() {
    super(key.scene.main);
  }

  create() {
    this.tilemap = this.make.tilemap({ key: key.tilemap.tuxemon });

    // Parameters are the name you gave the tileset in Tiled and
    // the key of the tileset image in Phaser's cache (name used in preload)
    const tileset = this.tilemap.addTilesetImage(
      TILESET_NAME,
      key.image.tuxemon,
    )!;

    // Parameters: layer name (or index) from Tiled, tileset, x, y
    this.tilemap.createLayer(TilemapLayer.BelowPlayer, tileset, 0, 0);
    this.worldLayer = this.tilemap.createLayer(
      TilemapLayer.World,
      tileset,
      0,
      0,
    )!;
    const aboveLayer = this.tilemap.createLayer(
      TilemapLayer.AbovePlayer,
      tileset,
      0,
      0,
    )!;

    this.worldLayer.setCollisionByProperty({ collides: true });
    this.physics.world.bounds.width = this.worldLayer.width;
    this.physics.world.bounds.height = this.worldLayer.height;

    // By default, everything gets depth sorted on the screen in the order we created things.
    // We want the "Above Player" layer to sit on top of the player, so we explicitly give it a depth.
    // Higher depths will sit on top of lower depth objects.
    aboveLayer.setDepth(Depth.AbovePlayer);

    this.addPlayer();
    this.createZones();

    // Set the bounds of the camera
    this.cameras.main.setBounds(
      0,
      0,
      this.tilemap.widthInPixels,
      this.tilemap.heightInPixels,
    );

    render(<TilemapDebug tilemapLayer={this.worldLayer} />, this);

    state.isTypewriting = true;
    render(
      <Typewriter
        text="WASD or arrow keys to move."
        onEnd={() => (state.isTypewriting = false)}
      />,
      this,
    );

    this.input.keyboard!.on('keydown-ESC', () => {
      this.scene.pause(key.scene.main);
      this.scene.launch(key.scene.menu);
    });

    this.input.keyboard!.on('keydown-ENTER', () => {
      this.activeItem(this.player.x, this.player.y);
    });
  }

  private addPlayer() {
    // Object layers in Tiled let you embed extra info into a map like a spawn point or custom collision shapes.
    // In the tmx file, there's an object layer with a point named 'Spawn Point'.
    const spawnPoint = this.tilemap.findObject(
      TilemapLayer.Objects,
      ({ name }) => name === TilemapObject.SpawnPoint,
    )!;

    this.player = new Player(this, spawnPoint.x!, spawnPoint.y!);
    this.addPlayerSignInteraction();

    // Watch the player and worldLayer for collisions
    this.physics.add.collider(this.player, this.worldLayer);
  }

  private addPlayerSignInteraction() {
    const sign = this.tilemap.findObject(
      TilemapLayer.Objects,
      ({ name }) => name === TilemapObject.Sign,
    )!;

    this.sign = this.physics.add.staticBody(
      sign.x!,
      sign.y!,
      sign.width,
      sign.height,
    );
    this.sign.text = sign.properties[0].value;

    type ArcadeColliderType = Phaser.Types.Physics.Arcade.ArcadeColliderType;

    this.physics.add.overlap(
      this.sign as unknown as ArcadeColliderType,
      this.player.selector as unknown as ArcadeColliderType,
      (sign) => {
        if (this.player.cursors.space.isDown && !state.isTypewriting) {
          state.isTypewriting = true;

          render(
            <Typewriter
              text={(sign as unknown as Sign).text!}
              onEnd={() => (state.isTypewriting = false)}
            />,
            this,
          );
        }
      },
      undefined,
      this,
    );
  }

  private createZones() {
    this.zones = [
      // On bar
      new Zone(
        this.drinkBeer,
        { x: 500, y: 500 },
        { x: 1000, y: 1000 },
        'Drink a cold beer',
      ),
      new Zone(
        this.smoke,
        { x: 500, y: 500 },
        { x: 1000, y: 1000 },
        'Smoke a cigarette',
      ),
      new Zone(
        this.playDart,
        { x: 500, y: 500 },
        { x: 1000, y: 1000 },
        'Play darts with friends',
      ),
      new Zone(
        this.hangover,
        { x: 500, y: 500 },
        { x: 1000, y: 1000 },
        'Recover from a hangover',
      ),
      new Zone(
        this.stayTooMuchBar,
        { x: 500, y: 500 },
        { x: 1000, y: 1000 },
        'Stay too long at bar',
      ),

      // Outside
      new Zone(
        this.goHome,
        { x: 500, y: 500 },
        { x: 1000, y: 1000 },
        'Go back home',
      ),
      new Zone(
        this.goBar,
        { x: 500, y: 500 },
        { x: 1000, y: 1000 },
        'Go to the bar',
      ),
      new Zone(
        this.doBike,
        { x: 500, y: 500 },
        { x: 1000, y: 1000 },
        'Ride your bike',
      ),
      new Zone(
        this.work,
        { x: 500, y: 500 },
        { x: 1000, y: 1000 },
        'Work hard at job',
      ),
      new Zone(
        this.readBook,
        { x: 500, y: 500 },
        { x: 1000, y: 1000 },
        'Read a good book',
      ),
      new Zone(
        this.doVolley,
        { x: 500, y: 500 },
        { x: 1000, y: 1000 },
        'Play volleyball on court',
      ),
      new Zone(
        this.sleepBeach,
        { x: 500, y: 500 },
        { x: 1000, y: 1000 },
        'Nap on the beach',
      ),
      new Zone(
        this.peeOnFountain,
        { x: 500, y: 500 },
        { x: 1000, y: 1000 },
        'Pee near the fountain',
      ),
      new Zone(
        this.swim,
        { x: 500, y: 500 },
        { x: 1000, y: 1000 },
        'Swim in the water',
      ),
    ];
  }

  update() {
    this.player.update();
    this.logItem(this.player.x, this.player.y, this.player);
    console.log(`Player position: X=${this.player.x}, Y=${this.player.y}`);
  }

  activeItem(x: number, y: number) {
    this.zones.forEach((zone) => {
      zone.isInZone(x, y);
    });
  }

  logItem(x: number, y: number, player: Player) {
    let isInAnyZone = false;

    this.zones.forEach((zone) => {
      if (zone.logMessageIfInZone(x, y, player)) {
        isInAnyZone = true;
      }
    });

    if (!isInAnyZone) {
      player.setLabelVisible(false);
    }
  }

  sleepBed() {
    console.log('You are sleeping in the bed.');
  }

  eat() {
    console.log('You are eating a delicious meal.');
  }

  watchComputer() {
    console.log('You are watching the computer. Be mindful of screen time!');
  }

  watchReels() {
    console.log('You are watching reels on social media.');
  }

  goOut() {
    console.log('You are going outside. Fresh air is good for you!');
  }

  stayTooMuchHome() {
    console.log("You've stayed at home too long. Maybe go out?");
  }

  drinkBeer() {
    console.log('You are drinking a cold beer. Cheers!');
  }

  smoke() {
    console.log('You are smoking. Health warning: smoking is bad for you.');
  }

  playDart() {
    console.log('You are playing darts. Good luck!');
  }

  hangover() {
    console.log('You have a hangover. Drink some water and rest.');
  }

  stayTooMuchBar() {
    console.log("You've stayed too long at the bar. Time to head home?");
  }

  goHome() {
    console.log('You are heading back home.');
  }

  goBar() {
    console.log('You are going to the bar.');
  }

  doBike() {
    console.log('You are biking. Keep up the cardio!');
  }

  work() {
    console.log("You are working hard. Don't forget to take breaks!");
  }

  readBook() {
    console.log('You are reading a book. Enjoy the story.');
  }

  doVolley() {
    console.log('You are playing volleyball. Great teamwork!');
  }

  sleepBeach() {
    console.log('You are sleeping on the beach. Relax and enjoy the waves.');
  }

  peeOnFountain() {
    console.log('You are peeing on a fountain. Not cool...');
  }

  swim() {
    console.log('You are swimming in the water. Stay safe!');
  }
}

class Zone {
  action: () => void;
  bottomLeftCorner: { x: number; y: number };
  topRightCorner: { x: number; y: number };
  message: string;

  constructor(
    action: () => void,
    bottomLeftCorner: { x: number; y: number },
    topRightCorner: { x: number; y: number },
    message: string,
  ) {
    if (
      bottomLeftCorner.x > topRightCorner.x ||
      topRightCorner.y < bottomLeftCorner.y
    ) {
      throw new Error(
        `Invalid zone : bottomLeftCorner must be above and to the left of topRightCorner.`,
      );
    }

    this.action = action;
    this.bottomLeftCorner = bottomLeftCorner;
    this.topRightCorner = topRightCorner;
    this.message = message;
  }

  isInZone(x: number, y: number): void {
    const isWithinXBounds =
      x >= this.bottomLeftCorner.x && x <= this.topRightCorner.x;
    const isWithinYBounds =
      y <= this.topRightCorner.y && y >= this.bottomLeftCorner.y;

    if (isWithinXBounds && isWithinYBounds) {
      this.action();
    }
  }

  logMessageIfInZone(x: number, y: number, player: Player): boolean {
    const isWithinXBounds =
      x >= this.bottomLeftCorner.x && x <= this.topRightCorner.x;
    const isWithinYBounds =
      y <= this.topRightCorner.y && y >= this.bottomLeftCorner.y;

    if (isWithinXBounds && isWithinYBounds) {
      if (player.getLabelText() !== this.message) {
        player.setLabelText(this.message);
        player.setLabelVisible(true);
      }
      return true; // Retourne true si le joueur est dans la zone
    }

    return false; // Retourne false si le joueur n'est pas dans cette zone
  }
}
