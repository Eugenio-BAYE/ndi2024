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
    this.load.image('roomTileset1', assets.tilesets.roomTileset1);
    this.load.image('roomTileset2', assets.tilesets.roomTileset2);
    this.load.image('roomTileset3', assets.tilesets.roomTileset3);
    this.load.image('roomTileset4', assets.tilesets.roomTileset4);
    this.load.image('roomTileset5', assets.tilesets.roomTileset5);

    this.load.tilemapTiledJSON(key.tilemap.tuxemon, assets.tilemaps.tuxemon);
    this.load.tilemapTiledJSON(key.tilemap.room, assets.tilemaps.room);
    this.load.atlas(key.atlas.player, assets.atlas.image, assets.atlas.data);
  }

  create() {
    this.scene.start(key.scene.room);
  }
}
