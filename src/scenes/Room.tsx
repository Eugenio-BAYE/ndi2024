import Phaser from 'phaser';

import { Depth, key, TilemapLayer, TilemapObject } from '../constants';
import { Player } from '../sprites';

export class Room extends Phaser.Scene {
  private player!: Player;
  private tilemap!: Phaser.Tilemaps.Tilemap;
  private worldLayer!: Phaser.Tilemaps.TilemapLayer;

  constructor() {
    super(key.scene.room);
  }

  create() {
    this.tilemap = this.make.tilemap({ key: key.tilemap.room });

    // Add the tilesets to the tilemap
    const tileset1 = this.tilemap.addTilesetImage(key.image.room1)!;
    const tileset2 = this.tilemap.addTilesetImage(key.image.room2)!;
    const tileset3 = this.tilemap.addTilesetImage(key.image.room3)!;
    const tileset4 = this.tilemap.addTilesetImage(key.image.room4)!;
    const tileset5 = this.tilemap.addTilesetImage(key.image.room5)!;

    const tilesets = [tileset1, tileset2, tileset3, tileset4, tileset5];

    this.tilemap.createLayer(TilemapLayer.BelowPlayer, tilesets, 0, 0);
    this.worldLayer = this.tilemap.createLayer(
      TilemapLayer.World,
      tilesets,
      0,
      0,
    )!;
    const aboveLayer = this.tilemap.createLayer(
      TilemapLayer.AbovePlayer,
      tilesets,
      0,
      0,
    )!;

    this.worldLayer.setCollisionByProperty({ collides: true });
    this.physics.world.bounds.width = this.worldLayer.width;
    this.physics.world.bounds.height = this.worldLayer.height;

    aboveLayer.setDepth(Depth.AbovePlayer);

    this.addPlayer();

    this.cameras.main.setBounds(
      0,
      0,
      this.tilemap.widthInPixels,
      this.tilemap.heightInPixels,
    );
  }

  private addPlayer() {
    const spawnPoint = this.tilemap.findObject(
      TilemapLayer.Objects,
      ({ name }) => name === TilemapObject.SpawnPoint,
    )!;

    this.player = new Player(this, spawnPoint.x!, spawnPoint.y!);

    this.physics.add.collider(this.player, this.worldLayer);
  }

  update() {
    this.player.update();
  }
}
