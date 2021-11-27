export default class utilClass {
  constructor() {
    this.debug = true;
    this.setupLogger();
  }

  setupLogger() {
    Object.defineProperty(this, 'log', {
      get: function () {
        return this.debug
          ? console.log.bind(
              window.console,
              '[' + Date.now() + ']',
              `[${this.constructor.name}]`
            )
          : function () {};
      },
    });
  }
}
