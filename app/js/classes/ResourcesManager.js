class ResourcesManager {

    static getInstance() {
        if (ResourcesManager.instance == null) {
            ResourcesManager.instance = new ResourcesManager();
        }
        return ResourcesManager.instance;
    }

    constructor() {
        this.events = new PIXI.utils.EventEmitter();
        this._resources = [];
        this._textures = [
            "resources/svgs/BlockFichier 1.svg",
            "resources/svgs/TrashFichier 1.svg"
        ];
        this._animations = [
            {
                name: "QuandJeFaisRien",
                start: 486,
                stop: 538,
                urlPattern: "resources/svgs/QuandJeFaisRienFichier {0}.svg",
                animationSpeed: 0.4
            },
            {
                name: "Enerve",
                start: 1,
                stop: 13,
                urlPattern: "resources/svgs/EnerveFichier {0}.svg",
                animationSpeed: 0.1
            },
            {
                name: "Marcher",
                start: 1,
                stop: 15,
                urlPattern: "resources/svgs/MarcherFichier {0}.svg",
                animationSpeed: 1
            },
            {
                name: "Sauter",
                start: 1,
                stop: 21,
                urlPattern: "resources/svgs/SauterFichier {0}.svg",
                animationSpeed: 0.5
            }
        ];
    }

    getAnimation(animationName) {
        let animation = null;
        this._animations.forEach((resource) => {
            if (resource.name == animationName) {
                animation = resource;
                return;
            }
        });
        return animation;
    }

    getTexture(name) {
        return this._resources[name].texture;
    }

    getTexturesArray(animation) {
        const textures = [];
        for (let i = animation.start; i <= animation.stop; i++) {
            textures.push(this._resources[animation.urlPattern.replace("{0}", i)].texture);
        }
        return textures;
    }

    load() {
        const promise = new Promise((resolve, reject) => {
            this._textures.forEach((resource) => {
                PIXI.Loader.shared.add(resource);
            });
            this._animations.forEach((resource) => {
                for (let i = resource.start; i <= resource.stop; i++) {
                    PIXI.Loader.shared.add(resource.urlPattern.replace("{0}", i));
                }
            });
            PIXI.Loader.shared.load((loader, resources) => {
                this._resources = resources;
                resolve();
            }).onProgress.add((loader, resource) => {
                this.events.emit("progress", {
                    resourceUrl: resource.url,
                    progress: loader.progress
                });
                console.log("loading: " + resource.url);
                console.log("progress: " + loader.progress + "%");
            });
        });
        return promise;
    }
}

export default ResourcesManager;