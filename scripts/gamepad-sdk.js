class GamepadSDK {
  constructor() {
    this.gamepads = [];
    this.previousState = {};
    this.listeners = {
      buttonpress: [],
      buttonrelease: [],
      axischange: [],
      connect: [],
      disconnect: [],
    };

    window.addEventListener('gamepadconnected', (e) => this.onGamepadConnected(e));
    window.addEventListener('gamepaddisconnected', (e) => this.onGamepadDisconnected(e));

    this.pollGamepads();
  }

  // Register event listeners
  addEventListener(event, callback) {
    if (this.listeners[event]) {
      this.listeners[event].push(callback);
    }
  }

  onGamepadConnected(event) {
    console.log('Gamepad connected:', event.gamepad);
    this.gamepads[event.gamepad.index] = event.gamepad;

    // Initialize previous state for buttons and axes
    this.previousState[event.gamepad.index] = {
      buttons: event.gamepad.buttons.map(() => ({ pressed: false })),
      axes: event.gamepad.axes.slice(),
    };

    // Trigger 'connect' event
    this.triggerEvent('connect', { gamepad: event.gamepad });
  }

  onGamepadDisconnected(event) {
    console.log('Gamepad disconnected:', event.gamepad);

    // Trigger 'disconnect' event
    this.triggerEvent('disconnect', { gamepad: event.gamepad });

    delete this.gamepads[event.gamepad.index];
    delete this.previousState[event.gamepad.index];
  }

  pollGamepads() {
    const gamepads = navigator.getGamepads ? navigator.getGamepads() : [];

    gamepads.forEach((gamepad, index) => {
      if (gamepad) {
        this.checkButtonPresses(gamepad, index);
        this.checkAxesChanges(gamepad, index);
      }
    });

    requestAnimationFrame(() => this.pollGamepads());
  }

  checkButtonPresses(gamepad, index) {
    const previousButtons = this.previousState[gamepad.index] ? this.previousState[gamepad.index].buttons : [];

    gamepad.buttons.forEach((button, i) => {
      if (button.pressed && (!previousButtons[i] || !previousButtons[i].pressed)) {
        this.triggerEvent('buttonpress', { gamepad, button, buttonIndex: i });
      } else if (!button.pressed && previousButtons[i] && previousButtons[i].pressed) {
        this.triggerEvent('buttonrelease', { gamepad, button, buttonIndex: i });
      }
    });

    this.previousState[gamepad.index] = {
      ...this.previousState[gamepad.index],
      buttons: gamepad.buttons.map((btn) => ({ pressed: btn.pressed })),
    };
  }

  checkAxesChanges(gamepad, index) {
    const previousAxes = this.previousState[gamepad.index] ? this.previousState[gamepad.index].axes : [];

    gamepad.axes.forEach((axis, i) => {
      if (axis !== previousAxes[i]) {
        this.triggerEvent('axischange', { gamepad, axisValue: axis, axisIndex: i });
      }
    });

    this.previousState[gamepad.index] = {
      ...this.previousState[gamepad.index],
      axes: gamepad.axes.slice(), // Copy current axes state
    };
  }

  triggerEvent(event, detail) {
    this.listeners[event].forEach((callback) => callback(detail));
  }
}
