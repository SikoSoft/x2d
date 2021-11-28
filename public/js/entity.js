import utilClass from './utilClass.js';

export default class entity extends utilClass {
  constructor(g) {
    super();
    this.g = g;
    this.x = 0;
    this.y = 0;
    this.w = 0;
    this.h = 0;
  }

  moveTo(x, y) {}

  update() {}
}
