import entity from './entity.js';

export default class player extends entity {
  constructor(g) {
    super();
    this.g = g;
    this.speed = 32;
  }

  registerInput(input) {
    this.input = input;
    this.g.input.register(input, this);
  }
}
