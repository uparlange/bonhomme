import BaseClass from "./BaseClass.js";

class KeyboardManager extends BaseClass {

    static getInstance() {
        if (KeyboardManager.instance == null) {
            KeyboardManager.instance = new KeyboardManager();
        }
        return KeyboardManager.instance;
    }

    constructor() {
        super();
        this._keyboard = {};
        this.events = new PIXI.utils.EventEmitter();
        window.addEventListener("keydown", (event) => {
            let key = this._keyboard[event.keyCode];
            if (!key) {
                key = { isUp: true, isDown: false };
                this._keyboard[event.keyCode] = key;
            }
            if (key.isUp) {
                this.events.emit("keyPressed", event);
            }
            key.isDown = true;
            key.isUp = false;
        });
        window.addEventListener("keyup", (event) => {
            let key = this._keyboard[event.keyCode];
            if (key) {
                if (key.isDown) {
                    this.events.emit("keyReleased", event);
                }
                key.isDown = false;
                key.isUp = true;
            }
        });
    }

}

export default KeyboardManager;