import GamepadManager from "./GamepadManager.js";

class ApplicationManager {

    static STAGE_W = 1200;
    static STAGE_H = 580;

    static getInstance() {
        if (ApplicationManager.instance == null) {
            ApplicationManager.instance = new ApplicationManager();
        }
        return ApplicationManager.instance;
    }

    constructor() {
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
        }
    }

    setState(stateName, params) {
        if (this._states[stateName] == null) {
            import("/js/states/" + stateName + ".js").then((module) => {
                const scene = new PIXI.Container();
                this._app.stage.addChild(scene);
                this._states[stateName] = {
                    name: stateName,
                    instance: module.default,
                    scene: scene
                }
                module.default.setup({
                    scene: scene
                });
                this._setState(this._states[stateName], params);
            });
        } else {
            this._setState(this._states[stateName], params);
        }
    }

    _gameLoop(delta) {
        const speed = 5 * delta;
        GamepadManager.getInstance().tick();
        if (this._currentState != null) {
            this._currentState.instance.tick(delta);
        }
    }

    _setState(state, params) {
        if (this._currentState != null) {
            this._currentState.instance.beforeLeave();
            this._app.stage.removeChild(this._currentState.scene);
        }
        console.log("setState '" + state.name + "'");
        this._currentState = state;
        this._app.stage.addChild(this._currentState.scene);
        this._currentState.instance.beforeEnter(params);
    }
}

export default ApplicationManager;