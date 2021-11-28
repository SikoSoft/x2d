import utilClass from './utilClass.js';
import config from './config.js';
import localPlayer from './localPlayer.js';
import input from './input.js';
import render from './render.js';

export default class x2d extends utilClass {
  constructor() {
    super();
    this.players = [];
  }

  init({ canvasId }) {
    this.log('init');
    this.canvasId = canvasId;
    this.input = new input(this);
    this.config = new config(this);
    this.render = new render(this);
    this.run();
    this.registerLocalPlayer(0);
    window.g = this;
  }

  registerLocalPlayer(inputDevice = 0) {
    const p = new localPlayer(this);
    if (inputDevice > -1) {
      p.registerInput(inputDevice);
    }
    this.players.push(p);
    return this.players.length - 1;
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
