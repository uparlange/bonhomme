import GamepadManager from "./GamepadManager.js";
import KeyboardManager from "./KeyboardManager.js";
import BaseClass from "./BaseClass.js";

class ApplicationManager extends BaseClass {

    static STAGE_W = 800;
    static STAGE_H = 600;

    static getInstance() {
        if (ApplicationManager.instance == null) {
            ApplicationManager.instance = new ApplicationManager();
        }
        return ApplicationManager.instance;
    }

    constructor () {
        super();
        this._app = null;
        this._currentState = null;
        this._states = {};
    }

    init(params) {
        if (this._app == null) {
            this._app = new PIXI.Application(params);
            document.body.appendChild(this._app.view);
            this._app.ticker.add((delta) => {
                this._gameLoop(delta);
            });
            this.setState("loading");
            KeyboardManager.getInstance().events.on("keyPressed", (event) => {
                this._executeStateInstanceMethod("keyPressed", event);
            });
            KeyboardManager.getInstance().events.on("keyReleased", (event) => {
                this._executeStateInstanceMethod("keyReleased", event);
            });
            GamepadManager.getInstance().events.on("buttonPressed", (event) => {
                this._executeStateInstanceMethod("buttonPressed", event);
            });
            GamepadManager.getInstance().events.on("buttonReleased", (event) => {
                this._executeStateInstanceMethod("buttonReleased", event);
            });
        }
    }

    setState(stateName, params) {
        if (this._states[stateName] == null) {
            import("/js/states/" + stateName + ".js").then((module) => {
                const scene = new PIXI.Container();
                this._app.stage.addChild(scene);
                this._states[stateName] = {
                    _initialized: false,
                    name: stateName,
                    instance: module.default,
                    scene: scene
                }
                this._setState(this._states[stateName], params);
            });
        } else {
            this._setState(this._states[stateName], params);
        }
    }

    _gameLoop(delta) {
        const speed = 5 * delta;
        GamepadManager.getInstance().tick();
        this._executeStateInstanceMethod("tick", delta);
    }

    _setState(nextState, params) {
        if (this._currentState != null) {
            this._executeStateInstanceMethod("beforeLeave");
            this._app.stage.removeChild(this._currentState.scene);
        }
        this.getLogger().info("state : " + nextState.name);
        this._currentState = nextState;
        this._app.stage.addChild(nextState.scene);
        if (!nextState._initialized) {
            nextState.instance._scene = nextState.scene;
            this._executeStateInstanceMethod("setup");
            nextState._initialized = true;
        }
        this._executeStateInstanceMethod("beforeEnter", params);
    }

    _executeStateInstanceMethod(methodName, params) {
        if (this._currentState != null &&
            this._currentState.instance != null &&
            typeof (this._currentState.instance[methodName]) === "function") {
            this._currentState.instance[methodName](params);
        }
    }
}

export default ApplicationManager;