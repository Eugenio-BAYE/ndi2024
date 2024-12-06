import { Player } from './../sprites/Player';

export class Zone {
  action: () => void;
  topLeftCorner: { x: number; y: number };
  bottomRightCorner: { x: number; y: number };
  message: string;

  constructor(
    action: () => void,
    topLeftCorner: { x: number; y: number },
    bottomRightCorner: { x: number; y: number },
    message: string,
  ) {
    if (
      topLeftCorner.x > bottomRightCorner.x ||
      bottomRightCorner.y < topLeftCorner.y
    ) {
      throw new Error(
        `Invalid zone : topLeftCorner must be above and to the left of bottomRightCorner.`,
      );
    }

    this.action = action;
    this.topLeftCorner = topLeftCorner;
    this.bottomRightCorner = bottomRightCorner;
    this.message = message;
  }

  isInZone(x: number, y: number): void {
    const isWithinXBounds =
      x >= this.topLeftCorner.x && x <= this.bottomRightCorner.x;
    const isWithinYBounds =
      y <= this.bottomRightCorner.y && y >= this.topLeftCorner.y;

    if (isWithinXBounds && isWithinYBounds) {
      this.action();
    }
  }

  logMessageIfInZone(x: number, y: number, player: Player): boolean {
    const isWithinXBounds =
      x >= this.topLeftCorner.x && x <= this.bottomRightCorner.x;
    const isWithinYBounds =
      y <= this.bottomRightCorner.y && y >= this.topLeftCorner.y;

    if (isWithinXBounds && isWithinYBounds) {
      if (player.getLabelText() !== this.message || !player.getLabelVisible()) {
        player.setLabelText(this.message);
        player.setLabelVisible(true);
      }
      return true; // Retourne true si le joueur est dans la zone
    }

    return false; // Retourne false si le joueur n'est pas dans cette zone
  }
}
