import Sprite from "./Sprite.js";
import ResourcesManager from "./ResourcesManager.js";

class AnimatedSprite extends Sprite {

    constructor(container, textures) {
        super(container, textures);
        this._currentAnimation = null;
    }

    setAnimation(animationName) {
        if (this._currentAnimation != animationName) {
            this._currentAnimation = animationName;
            const animation = ResourcesManager.getInstance().getAnimation(animationName);
            this._sprite.textures = ResourcesManager.getInstance().getTexturesArray(animation);
            this._sprite.animationSpeed = animation.animationSpeed;
            this._sprite.loop = false;
            this._sprite.play();
        }
    }

    _getNewInstance() {
        return new PIXI.AnimatedSprite(this._textures);
    }
}

export default AnimatedSprite;