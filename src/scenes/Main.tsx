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
      new Zone(this.zone1, { x: 500, y: 500 }, { x: 1000, y: 1000 }),
      new Zone(this.zone2, { x: 1000, y: 1000 }, { x: 1500, y: 1500 }),
    ];
  }

  update() {
    this.player.update();
    console.log(`Player position: X=${this.player.x}, Y=${this.player.y}`);
  }

  activeItem(x: number, y: number) {
    this.zones.forEach((zone) => {
      zone.isInZone(x, y);
    });
  }

  zone1() {
    console.log('on est dans zone 1');
  }

  zone2() {
    console.log('on est dans zone 2');
  }
}

class Zone {
  action: () => void;
  bottomLeftCorner: { x: number; y: number };
  topRightCorner: { x: number; y: number };

  constructor(
    action: () => void,
    bottomLeftCorner: { x: number; y: number },
    topRightCorner: { x: number; y: number },
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
  }

  // Méthode pour vérifier si un point est dans cette zone
  isInZone(x: number, y: number): void {
    const isWithinXBounds =
      x >= this.bottomLeftCorner.x && x <= this.topRightCorner.x;
    const isWithinYBounds =
      y <= this.topRightCorner.y && y >= this.bottomLeftCorner.y;

    if (isWithinXBounds && isWithinYBounds) {
      this.action();
    }
  }
}
