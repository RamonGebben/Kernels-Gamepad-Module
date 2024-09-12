
Hooks.on('ready', () => {
  console.log("Gamepad Macro Trigger Module Loaded!");

  // Initialize the Gamepad SDK
  const myGamepad = new GamepadSDK();

  // Define a helper function to trigger macros by name
  function triggerMacro(macroName) {
    const macro = game.macros.find(m => m.name === macroName);
    if (macro) {
      macro.execute();
      ui.notifications.info(`Triggered Macro: ${macroName}`);
    } else {
      ui.notifications.error(`Macro not found: ${macroName}`);
    }
  }

  // Listen for button presses
  myGamepad.addEventListener('buttonpress', (event) => {
    console.log(`Button ${event.buttonIndex} pressed on gamepad ${event.gamepad.index}`);

    // Example: Trigger macros based on button presses
    switch (event.buttonIndex) {
      case 0:
        triggerMacro("Fireball");  // Trigger "Fireball" macro when button 1 is pressed
        break;
      case 1:
        triggerMacro("Healing Word");  // Trigger "Healing Word" macro when button 2 is pressed
        break;
      case 2:
        triggerMacro("Lightning Bolt");  // Trigger "Lightning Bolt" macro when button 3 is pressed
        break;
      case 3:
        triggerMacro("Mage Hand");  // Trigger "Mage Hand" macro when button 4 is pressed
        break;
    }
  });

  // Listen for button releases
  myGamepad.addEventListener('buttonrelease', (event) => {
    console.log(`Button ${event.buttonIndex} released on gamepad ${event.gamepad.index}`);
  });

  // Listen for axis changes (e.g., joysticks or triggers)
  myGamepad.addEventListener('axischange', (event) => {
    console.log(`Axis ${event.axisIndex} changed to ${event.axisValue} on gamepad ${event.gamepad.index}`);

    // Example: Adjust camera or token movement based on axis values
    if (event.axisIndex === 0) {
      if (event.axisValue > 0.5) {
        // Move token right or change scene perspective
      } else if (event.axisValue < -0.5) {
        // Move token left or change scene perspective
      }
    }
  });
});

Hooks.on('renderSceneControls', (controls, html) => {
  let button = $(`<li class="control-tool"><i class="fas fa-gamepad"></i> Gamepad</li>`);
  html.append(button);

  button.on('click', () => {
    ui.notifications.info("Gamepad Module Active! You can use the gamepad for macros.");
  });
});

