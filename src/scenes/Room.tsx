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
import { ChoiceDialog } from './ChoiceDialog';
import { Zone } from './Zone';

export class Room extends Phaser.Scene {
  private player!: Player;
  private tilemap!: Phaser.Tilemaps.Tilemap;
  private zones: Zone[] = [];

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
    this.createZones();

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

    this.input.keyboard!.on('keydown-ESC', () => {
      this.scene.pause(key.scene.room);
      this.scene.launch(key.scene.menu);
    });

    this.input.keyboard!.on('keydown-ENTER', () => {
      this.activeItem(this.player.x, this.player.y);
    });
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

  private createZones() {
    this.zones = [
      // Home
      new Zone(
        () => {
          this.sleepBed();
        },
        { x: 500, y: 500 },
        { x: 1000, y: 1000 },
        'Sleep in your bed',
      ),
      new Zone(
        () => {
          this.eat();
        },
        { x: 63, y: 100 },
        { x: 144, y: 191 },
        'Eat a delicious meal',
      ),
      new Zone(
        () => this.watchComputer(),
        { x: 59, y: 229 },
        { x: 97, y: 258 },
        'Watch your computer screen',
      ),
      new Zone(
        this.watchReels,
        { x: 500, y: 500 },
        { x: 1000, y: 1000 },
        'Watch social media reels',
      ),
      new Zone(
        this.goOut,
        { x: 158, y: 241 },
        { x: 193, y: 259 },
        'Go out for fresh air',
      ),
      new Zone(
        this.stayTooMuchHome,
        { x: 500, y: 500 },
        { x: 1000, y: 1000 },
        'Stay home too long',
      ),
    ];
  }

  update() {
    this.player.update();
    this.logItem(this.player.x, this.player.y, this.player);
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
    this.scene.pause(key.scene.room);
    ChoiceDialog.speakerName = 'TOIIIIIII';
    ChoiceDialog.question = 'What do you want to eat';
    ChoiceDialog.firstChoice = 'Healthy Food';
    ChoiceDialog.secondChoice = 'Junk Food';
    ChoiceDialog.firstChoiceCallback = () => this.eatHealthy();
    ChoiceDialog.secondChoiceCallback = () => this.eatJunkFood();
    this.scene.bringToTop(key.scene.choiceDialog);
    this.scene.launch(key.scene.choiceDialog);
    this.scene.resume();
  }

  eatHealthy() {
    this.player.eatHealthy();
  }

  eatJunkFood() {
    this.player.eatUnhealthy();
  }

  watchComputer() {
    this.scene.pause(key.scene.room);
    ChoiceDialog.speakerName = 'Gogole';
    ChoiceDialog.question = 'Are you sure you want to play ?';
    ChoiceDialog.firstChoice = 'Yes';
    ChoiceDialog.secondChoice = 'No';
    ChoiceDialog.firstChoiceCallback = () => this.watchReels();
    this.scene.bringToTop(key.scene.choiceDialog);
    this.scene.launch(key.scene.choiceDialog);
    this.scene.resume();
  }

  watchReels() {
    console.log('You are watching reels on social media.');
  }

  goOut() {
    console.log('You are going outside. Fresh air is good for you!');
    this.scene.pause(key.scene.room);
    ChoiceDialog.speakerName = 'Gogole';
    ChoiceDialog.question = 'Are you sure you want to leave?';
    ChoiceDialog.firstChoice = 'Yes';
    ChoiceDialog.secondChoice = 'No';
    ChoiceDialog.firstChoiceCallback = () => this.exit();
    this.scene.bringToTop(key.scene.choiceDialog);
    this.scene.launch(key.scene.choiceDialog);
    this.scene.resume();
  }

  stayTooMuchHome() {
    console.log("You've stayed at home too long. Maybe go out?");
  }

  exit() {
    this.scene.pause(key.scene.room);
    ChoiceDialog.speakerName = 'Gogole';
    ChoiceDialog.question = 'You stay too much time here, do something';
    ChoiceDialog.firstChoice = 'Oh';
    ChoiceDialog.secondChoice = 'Oh';
    this.player.stayAtHomeTooMuch();
    this.scene.bringToTop(key.scene.choiceDialog);
    this.scene.launch(key.scene.choiceDialog);
    this.scene.resume();
  }
}
