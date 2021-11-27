import utilClass from './utilClass.js';
import config from './config.js';
import render from './render.js';

export default class x2d extends utilClass {
  constructor() {
    super();
    this.config = new config(this);
    this.render = new render(this);
  }

  init({ canvasId }) {
    this.log('init');
    this.canvasId = canvasId;
    this.run();
    window.g = this;
  }

  run() {
    this.load().then(() => {
      this.render.init({ canvasId: this.canvasId, ...this.config.camera });
      setInterval(() => {
        this.update();
      }, 0);
    });
  }

  load() {
    return new Promise((resolve) => {
      this.config.load().then(() => {
        resolve();
      });
    });
  }

  update() {}
}
