const atlas = {
  player: 'player',
} as const;

const image = {
  spaceman: 'spaceman',
  tuxemon: 'tuxemon',
  room1: 'room1',
  room2: 'room2',
  room3: 'room3',
  room4: 'room4',
  room5: 'room5',
} as const;

const scene = {
  boot: 'boot',
  main: 'main',
  menu: 'menu',
  room: 'room',
  dialog: 'dialog',
  choiceDialog: 'choiceDialog',
} as const;

const tilemap = {
  tuxemon: 'tuxemon',
  room: 'room',
} as const;

export const key = {
  atlas,
  image,
  scene,
  tilemap,
} as const;
