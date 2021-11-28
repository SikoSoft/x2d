import player from './player.js';

export default class localPlayer extends player {
  constructor(g) {
    super();
    this.g = g;
    this.w = 32;
    this.h = 64;
  }

  moveUp() {
    this.moveTo(x, y);
  }

  moveDown() {
    this.moveTo(x, y);
  }

  moveLeft() {
    this.moveTo(x, y);
  }

  moveRight() {
    this.moveTo(x, y);
  }
}
