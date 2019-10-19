import BaseClass from "./BaseClass.js";

class GamepadManager extends BaseClass {

    static getInstance() {
        if (GamepadManager.instance == null) {
            GamepadManager.instance = new GamepadManager();
        }
        return GamepadManager.instance;
    }

    constructor() {
        super();
        this._gamepadIndex = -1;
        this._buttonStates = {};
        this.events = new PIXI.utils.EventEmitter();
        window.addEventListener("gamepadconnected", (e) => {
            const gp = navigator.getGamepads()[e.gamepad.index];
            this._gamepadIndex = gp.index;
            this.getLogger().info("Gamepad connected at index %d: %s. %d buttons, %d axes.", gp.index, gp.id, gp.buttons.length, gp.axes.length);
        });
        window.addEventListener("gamepaddisconnected", (e) => {
            this._gamepadIndex = -1;
            this.getLogger().info("Contrôleur n°%d déconnecté : %s", e.gamepad.index, e.gamepad.id);
        });
    }

    tick() {
        if (this._gamepadIndex != -1) {
            const gp = navigator.getGamepads()[this._gamepadIndex];
            gp.buttons.forEach((button, index) => {
                if (button.pressed) {
                    this.events.emit("buttonPressed", { index: index });
                    this._buttonStates[index] = true;
                } else {
                    if (this._buttonStates[index] == true) {
                        this.events.emit("buttonReleased", { index: index });
                    }
                    this._buttonStates[index] = false;
                }
            });
        }
    }

}

export default GamepadManager;