import utilClass from './utilClass';

export default class entity extends utilClass {
  constructor(g) {
    super();
    this.g = g;
    this.x = 0;
    this.y = 0;
  }

  moveTo(x, y) {}

  update() {}
}
