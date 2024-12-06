import Phaser from 'phaser';

import {
  key,
  TilemapLayer,
  TilemapObject,
  TILESET_ROOM1,
  TILESET_ROOM2,
  TILESET_ROOM3,
  TILESET_ROOM4,
  TILESET_ROOM5,
} from '../constants';
import { Player } from '../sprites';

export class Room extends Phaser.Scene {
  private player!: Player;
  private tilemap!: Phaser.Tilemaps.Tilemap;

  // Room layers
  private roomLayer1!: Phaser.Tilemaps.TilemapLayer;
  private roomLayer2!: Phaser.Tilemaps.TilemapLayer;
  private roomLayer3!: Phaser.Tilemaps.TilemapLayer;
  private roomLayer4!: Phaser.Tilemaps.TilemapLayer;
  private roomLayer5!: Phaser.Tilemaps.TilemapLayer;
  private roomLayer6!: Phaser.Tilemaps.TilemapLayer;
  private roomLayer7!: Phaser.Tilemaps.TilemapLayer;

  constructor() {
    super(key.scene.room);
  }

  create() {
    this.tilemap = this.make.tilemap({ key: key.tilemap.room });

    // Add the tilesets to the tilemap
    const tileset1 = this.tilemap.addTilesetImage(
      TILESET_ROOM1,
      key.image.room1,
    )!;

    const tileset2 = this.tilemap.addTilesetImage(
      TILESET_ROOM2,
      key.image.room2,
    )!;

    const tileset3 = this.tilemap.addTilesetImage(
      TILESET_ROOM3,
      key.image.room3,
    )!;

    const tileset4 = this.tilemap.addTilesetImage(
      TILESET_ROOM4,
      key.image.room4,
    )!;

    const tileset5 = this.tilemap.addTilesetImage(
      TILESET_ROOM5,
      key.image.room5,
    )!;

    const tilesets = [tileset1, tileset2, tileset3, tileset4, tileset5];

    this.roomLayer1 = this.tilemap.createLayer(
      TilemapLayer.Room1,
      tilesets,
      0,
      0,
    )!;

    this.roomLayer2 = this.tilemap.createLayer(
      TilemapLayer.Room2,
      tilesets,
      0,
      0,
    )!;

    this.roomLayer3 = this.tilemap.createLayer(
      TilemapLayer.Room3,
      tilesets,
      0,
      0,
    )!;

    this.roomLayer4 = this.tilemap.createLayer(
      TilemapLayer.Room4,
      tilesets,
      0,
      0,
    )!;

    this.roomLayer5 = this.tilemap.createLayer(
      TilemapLayer.Room5,
      tilesets,
      0,
      0,
    )!;

    this.roomLayer6 = this.tilemap.createLayer(
      TilemapLayer.Room6,
      tilesets,
      0,
      0,
    )!;

    this.roomLayer7 = this.tilemap.createLayer(
      TilemapLayer.Room7,
      tilesets,
      0,
      0,
    )!;

    this.roomLayer1.setCollisionByProperty({ collides: true });
    this.physics.world.bounds.width = this.roomLayer1.width;
    this.physics.world.bounds.height = this.roomLayer2.height;

    this.roomLayer2.setCollisionByProperty({ collides: true });
    this.physics.world.bounds.width = this.roomLayer2.width;
    this.physics.world.bounds.height = this.roomLayer2.height;

    this.roomLayer3.setCollisionByProperty({ collides: true });
    this.physics.world.bounds.width = this.roomLayer3.width;
    this.physics.world.bounds.height = this.roomLayer3.height;

    this.roomLayer4.setCollisionByProperty({ collides: true });
    this.physics.world.bounds.width = this.roomLayer4.width;
    this.physics.world.bounds.height = this.roomLayer4.height;

    this.roomLayer5.setCollisionByProperty({ collides: true });
    this.physics.world.bounds.width = this.roomLayer5.width;
    this.physics.world.bounds.height = this.roomLayer5.height;

    this.roomLayer6.setCollisionByProperty({ collides: true });
    this.physics.world.bounds.width = this.roomLayer6.width;
    this.physics.world.bounds.height = this.roomLayer6.height;

    this.roomLayer7.setCollisionByProperty({ collides: true });
    this.physics.world.bounds.width = this.roomLayer7.width;
    this.physics.world.bounds.height = this.roomLayer7.height;

    this.addPlayer();

    this.cameras.main.setZoom(2);
    this.cameras.main.setBounds(
      0,
      0,
      this.tilemap.widthInPixels,
      this.tilemap.heightInPixels,
    );
    this.cameras.main.startFollow(this.player);
  }

  private addPlayer() {
    const spawnPoint = this.tilemap.findObject(
      TilemapLayer.Objects,
      ({ name }) => name === TilemapObject.SpawnPoint,
    )!;

    this.player = new Player(this, spawnPoint.x!, spawnPoint.y!);

    this.physics.add.collider(this.player, this.roomLayer1);
    this.physics.add.collider(this.player, this.roomLayer2);
    this.physics.add.collider(this.player, this.roomLayer3);
    this.physics.add.collider(this.player, this.roomLayer4);
    this.physics.add.collider(this.player, this.roomLayer5);
    this.physics.add.collider(this.player, this.roomLayer6);
    this.physics.add.collider(this.player, this.roomLayer7);
  }

  update() {
    this.player.update();
  }
}
