import player from './player.js';

export default class localPlayer extends player {
  constructor(g) {
    super();
    this.g = g;
  }
}
