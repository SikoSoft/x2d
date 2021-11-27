import utilClass from './utilClass.js';

export default class camera extends utilClass {
  constructor(g) {
    super();
    this.g = g;
  }

  init({ canvasId, width, height }) {
    this.log('init');
    this.canvas = document.getElementById(canvasId);
    this.canvas.width = width;
    this.canvas.height = height;
  }
}
