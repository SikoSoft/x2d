import utilClass from './utilClass.js';

export default class camera extends utilClass {
  constructor(g) {
    super();
    this.g = g;
    this.canvas = document.getElementById(this.g.canvasId);
    if (this.canvas.getContext) {
      this.ctx = this.canvas.getContext('2d');
    }
  }

  init() {
    this.log('init');
    this.canvas.width = this.g.config.camera.width;
    this.canvas.height = this.g.config.camera.height;
  }

  draw() {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    this.drawBackground();
  }

  drawBackground() {
    this.ctx.save();
    this.ctx.fillStyle = this.g.config.theme.background;
    this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
    this.ctx.restore();
  }
}
