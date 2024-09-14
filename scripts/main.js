Hooks.once('init', () => {
  console.log("Initializing Gamepad Macro Trigger with SDK");

  // Register a setting for each gamepad button to macro mapping
  for (let i = 0; i < 12; i++) {
    game.settings.register('gamepad-macro-trigger', `button-${i}-macro`, {
      name: `Macro for Gamepad Button ${i}`,
      hint: `Set the macro name to trigger when button ${i} is pressed.`,
      scope: 'world',
      config: true,
      type: String,
      default: ''
    });
  }
});

Hooks.on('ready', () => {
  console.log("Gamepad Macro Trigger Module Loaded!");

  // Initialize the Gamepad SDK
  const myGamepad = new GamepadSDK();

  // Helper function to update Token Controls with gamepad status
  function updateGamepadStatus(connected) {
    Hooks.once('getSceneControlButtons', (controls) => {
      // Find the token controls group
      const tokenControls = controls.find(control => control.name === 'token');

      // Remove any existing gamepad status button
      tokenControls.tools = tokenControls.tools.filter(tool => tool.name !== "gamepad-status");

      // Add a new tool to indicate the gamepad status
      tokenControls.tools.push({
        name: "gamepad-status",
        title: connected ? "Gamepad Connected" : "Gamepad Disconnected",
        icon: connected ? "fas fa-gamepad" : "fas fa-ban",
        visible: true,
        button: true,
        onClick: () => {
          ui.notifications.info(connected ? "Gamepad is connected and ready!" : "No gamepad detected.");
        }
      });
    });

    // Re-render the controls to show the updated status
    ui.controls.render();
  }

  // Listen for gamepad connection
  myGamepad.addEventListener('connect', (event) => {
    console.log(`Gamepad connected: ${event.gamepad.id}`);
    updateGamepadStatus(true);
  });

  // Listen for gamepad disconnection
  myGamepad.addEventListener('disconnect', (event) => {
    console.log(`Gamepad disconnected: ${event.gamepad.id}`);
    updateGamepadStatus(false);
  });

  // Handle button presses
  myGamepad.addEventListener('buttonpress', (event) => {
    console.log(`Button ${event.buttonIndex} pressed on gamepad: ${event.gamepad.id}`);

    // Retrieve the macro name for the button
    const macroName = game.settings.get('gamepad-macro-trigger', `button-${event.buttonIndex}-macro`);

    // Trigger the macro if it exists
    if (macroName) {
      triggerMacro(macroName);
    } else {
      console.log(`No macro assigned to button ${event.buttonIndex}`);
    }
  });

  // Function to trigger macros
  function triggerMacro(macroName) {
    const macro = game.macros.find(m => m.name === macroName);
    if (macro) {
      macro.execute();
      ui.notifications.info(`Triggered Macro: ${macroName}`);
    } else {
      ui.notifications.error(`Macro not found: ${macroName}`);
    }
  }

  // Initial status check if no gamepad is connected
  if (navigator.getGamepads().length === 0) {
    updateGamepadStatus(false);
  }
});
