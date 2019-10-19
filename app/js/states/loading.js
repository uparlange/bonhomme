import ResourcesManager from "../classes/ResourcesManager.js";
import ApplicationManager from "../classes/ApplicationManager.js";

export default {

    loadingText: null,

    setup() {
        this.loadingText = new PIXI.Text("Loading 0%");
        this.loadingText.position.set(10, 10);
        this._scene.addChild(this.loadingText);
    },

    beforeEnter(params) {
        ResourcesManager.getInstance().events.on("progress", (event) => {
            this.loadingText.text = "Loading " + Math.round(event.progress) + "%";
        });
        ResourcesManager.getInstance().load().then(() => {
            ApplicationManager.getInstance().setState("edit");
        });
    },

    tick() {

    },

    beforeLeave() {

    }

};