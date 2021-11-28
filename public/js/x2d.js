import utilClass from './utilClass.js';
import config from './config.js';
import render from './render.js';

export default class x2d extends utilClass {
  constructor() {
    super();
  }

  init({ canvasId }) {
    this.log('init');
    this.canvasId = canvasId;
    this.config = new config(this);
    this.render = new render(this);
    this.run();
    window.g = this;
  }

  run() {
    this.load().then(() => {
      this.render.init({ ...this.config.camera });
      setInterval(() => {
        this.update();
      }, 0);
      setInterval(() => {
        this.render.draw();
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
