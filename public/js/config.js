import utilClass from './utilClass.js';

export default class config extends utilClass {
  constructor(g) {
    super();
    this.g = g;
  }

  process(override) {
    for (let key in override) {
      this[key] = override[key];
    }
  }

  load() {
    return new Promise((resolve, reject) => {
      fetch('config.json')
        .then((response) => response.json())
        .then((data) => {
          this.process(data);
          this.log('loaded config.json');
          resolve();
        })
        .catch(() => {
          this.log('failed to load config.json');
          reject();
        });
    });
  }
}
