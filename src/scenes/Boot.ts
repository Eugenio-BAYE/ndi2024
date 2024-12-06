import { Scene } from 'phaser';

import * as assets from '../assets';
import { key } from '../constants';

export class Boot extends Scene {
  constructor() {
    super(key.scene.boot);
  }

  preload() {
    this.load.spritesheet(key.image.spaceman, assets.sprites.spaceman, {
      frameWidth: 16,
      frameHeight: 16,
    });

    this.load.image(key.image.tuxemon, assets.tilesets.tuxemon);
    this.load.image('room1', assets.tilesets.room1);
    this.load.image('room2', assets.tilesets.room2);
    this.load.image('room3', assets.tilesets.room3);
    this.load.image('room4', assets.tilesets.room4);
    this.load.image('room5', assets.tilesets.room5);

    this.load.tilemapTiledJSON(key.tilemap.tuxemon, assets.tilemaps.tuxemon);
    this.load.tilemapTiledJSON(key.tilemap.room, assets.tilemaps.room);
    this.load.atlas(key.atlas.player, assets.atlas.image, assets.atlas.data);
  }

  create() {
    this.scene.start(key.scene.room);
  }
}
