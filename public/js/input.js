import MAGIC_NUM from './magicNum.js';

export default class input {
  constructor(g) {
    this.g = g;
    this.keyState = {};
    this.keyBoardDevice = false;
    this.gamePadDetected = false;
    this.useGamePad = false;
    this.keyMap = {
      pause: 80,
      drop: 32,
      left: 37,
      rotate: 38,
      right: 39,
      down: 40,
      hold: 72,
      alt: 18,
      inputToggle: 90,
      f5: 116,
      f12: 123,
    };
    this.buttonMap = {
      [MAGIC_NUM.DEVICE_TYPE_XBOX360]: {
        pause: 9,
        drop: 3,
        left: 14,
        rotate: 0,
        right: 15,
        down: 13,
        hold: 5,
      },
    };
    this.stateActions = {
      waiting: {
        _all: () => {
          this.g.start();
        },
      },
      paused: {
        pause: () => {
          this.g.pause();
        },
      },
      gameplay: {
        pause: () => {
          this.g.pause();
        },
        drop: (player) => {
          player.placeFallingPieceAtBottom();
        },
        left: (player) => {
          player.movePiece(-1);
        },
        rotate: (player) => {
          player.rotatePiece();
        },
        right: (player) => {
          player.movePiece(1);
        },
        down: (player) => {
          player.adjustFallingHeightOffset();
        },
        hold: (player) => {
          player.toggleHold();
        },
      },
      gameplayLocked: {
        pause: () => {
          this.g.pause();
        },
      },
      ended: {
        _all: () => {
          this.g.restart();
        },
      },
    };
    this.lastButtonState = {};
    this.devices = [];
    this.setupDevice(MAGIC_NUM.DEVICE_TYPE_KEYBOARD);
  }

  init() {
    this.floodWait = {};
    Object.keys(this.keyMap).forEach((key) => {
      this.floodWait[key] = this.g.config.coolDown[key];
    });
    window.addEventListener(
      'keydown',
      (e) => {
        this.handleKeyDown(e);
      },
      false
    );
    window.addEventListener(
      'keyup',
      (e) => {
        this.handleKeyUp(e);
      },
      false
    );
    window.addEventListener('gamepadconnected', (event) => {
      this.gamePadDetected = true;
      this.lastButtonState = {};
      Object.keys(this.buttonMap).forEach((button) => {
        this.lastButtonState[button] = false;
      });
      const deviceType = this.getGamePadDeviceType(event.gamepad);
      if (deviceType !== MAGIC_NUM.DEVICE_TYPE_UNKNOWN) {
        this.setupDevice(deviceType, event.gamepad.index);
      }
    });
  }

  reset() {
    for (let key in this.keyState) {
      this.keyState[key] = false;
    }
    for (let key in this.lastFloodWait) {
      this.lastFloodWait[key] = 0;
    }
  }

  getGamePadDeviceType(gamePad) {
    switch (gamePad.id) {
      case 'Xbox 360 Controller (XInput STANDARD GAMEPAD)':
        return MAGIC_NUM.DEVICE_TYPE_XBOX360;
      default:
        return MAGIC_NUM.DEVICE_TYPE_UNKNOWN;
    }
  }

  setupDevice(type, gamePadIndex = -1) {
    const device = {
      type,
      id: this.devices.length,
      player: false,
      floodTimers: {},
      lastFloodWait: {},
      gamePadIndex,
    };
    this.devices.push(device);
    if (MAGIC_NUM.DEVICE_TYPE_KEYBOARD === type) {
      this.keyBoardDevice = device;
      Object.keys(this.keyMap).forEach((key) => {
        device.lastFloodWait[key] = 0;
      });
    } else if (MAGIC_NUM.DEVICE_TYPE_XBOX360 === type) {
      Object.keys(this.buttonMap).forEach((button) => {
        device.lastFloodWait[button] = 0;
      });
    }
    return device.id;
  }

  register(deviceId, player) {
    if (this.devices[deviceId] && this.devices[deviceId].player === false) {
      this.devices[deviceId].player = player;
    }
  }

  getAvailableDevice() {
    return this.devices.filter((device) => !device.player).length > 0
      ? this.devices.filter((device) => !device.player)[0].id
      : false;
  }

  process() {
    if (this.keyState[this.keyMap.alt]) {
      if (
        this.keyState[this.keyMap.inputToggle] &&
        this.floodSafe('inputToggle')
      ) {
        this.useGamePad = !this.useGamePad;
        this.setFloodTimer('inputToggle');
      }
      return;
    }
    let state = 'gameplayLocked';
    if (this.g.wait) {
      state = 'waiting';
    } else if (this.g.ended) {
      state = 'ended';
    } else if (this.g.paused) {
      state = 'paused';
    } else {
      state = 'gameplay';
    }
    this.devices.forEach((device) => {
      if (
        device.player &&
        (this.isLocked(device.player) || device.player.endLocked)
      ) {
        state = 'gameplayLocked';
      }
      if (
        device.type === MAGIC_NUM.DEVICE_TYPE_XBOX360 &&
        this.gamePadDetected &&
        device.player
      ) {
        const gamePad = navigator.getGamepads()[device.gamePadIndex];
        const buttonState = {};
        Object.keys(this.buttonMap).forEach((button) => {
          const isPressed = gamePad.buttons[this.buttonMap[button]].pressed;
          buttonState[button] = isPressed;
          if (this.lastButtonState[button] && !isPressed) {
            device.lastFloodWait[button] = 0;
          }
          if (isPressed && this.floodSafe(device, button)) {
            if (typeof this.stateActions[state][button] === 'function') {
              this.stateActions[state][button](device.player);
            }
            if (typeof this.stateActions[state]._all === 'function') {
              this.stateActions[state]._all(device.player);
            }
            this.setFloodTimer(device, button);
          }
        });
        this.lastButtonState = buttonState;
      } else if (device.type === MAGIC_NUM.DEVICE_TYPE_KEYBOARD) {
        Object.keys(this.keyMap).forEach((key) => {
          if (this.keyState[this.keyMap[key]] && this.floodSafe(device, key)) {
            if (typeof this.stateActions[state][key] === 'function') {
              this.stateActions[state][key](device.player);
            }
            if (typeof this.stateActions[state]._all === 'function') {
              this.stateActions[state]._all(device.player);
            }
            this.setFloodTimer(device, key);
          }
        });
      }
    });
  }

  floodSafe(device, key) {
    return !device.floodTimers[key];
  }

  setFloodTimer(device, key) {
    let floodTime = this.floodWait[key];
    if (device.lastFloodWait[key]) {
      floodTime =
        device.lastFloodWait[key] -
        device.lastFloodWait[key] * this.g.config.keyDecay;
    } else {
      floodTime = this.floodWait[key];
    }
    if (floodTime < this.g.config.minKeyRepeat) {
      floodTime = this.g.config.minKeyRepeat;
    }
    device.lastFloodWait[key] = floodTime;
    device.floodTimers[key] = setTimeout(() => {
      delete device.floodTimers[key];
    }, floodTime);
  }

  handleKeyDown(e) {
    if (!this.keyState[e.keyCode]) {
      this.keyState[e.keyCode] = new Date().getTime();
    }
    if (
      e.keyCode !== this.keyMap.f5 &&
      e.keyCode !== this.keyMap.f12 &&
      typeof e.preventDefault !== 'undefined'
    ) {
      e.preventDefault();
      return false;
    }
    return false;
  }

  handleKeyUp(e) {
    this.keyState[e.keyCode] = false;
    let commandName = '';
    Object.keys(this.keyMap).forEach((key) => {
      if (this.keyMap[key] === e.keyCode) {
        commandName = key;
      }
    });
    if (commandName) {
      this.keyBoardDevice.lastFloodWait[commandName] = 0;
    }
    for (let mi = this.keyMap.left; mi <= this.keyMap.down; mi++) {
      if (this.keyState[mi]) {
        e.preventDefault();
        this.handleKeyDown({
          keyCode: mi,
        });
      }
    }
    if (e.preventDefault) {
      e.preventDefault();
    }
    return false;
  }
}
