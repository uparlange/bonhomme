import ResourcesManager from "./ResourcesManager.js";
import AnimatedSprite from "./AnimatedSprite.js";

class Player extends AnimatedSprite {

    static getDefaultTextures() {
        const animation = ResourcesManager.getInstance().getAnimation("QuandJeFaisRien");
        return ResourcesManager.getInstance().getAnimationTextures(animation);
    }

    constructor(container) {
        super(container, Player.getDefaultTextures());
        this.VX_GAP = 5;
        this.VY_GAP = 5;
        this._noActionAnimationCount = 0;
        this._sprite.vy = this.VY_GAP;
        this._sprite.anchor.set(0.5);
        this._sprite.onFrameChange = (event) => {
            const currentAnimation = this._currentAnimation;
            switch (currentAnimation) {
                case "Sauter":
                    const animation = ResourcesManager.getInstance().getAnimation("Sauter");
                    if (event == Math.floor((animation.stop - animation.start + 1) / 2)) {
                        this.fall();
                    }
                    break;
            }
        };
        this._sprite.onComplete = (event) => {
            const currentAnimation = this._currentAnimation;
            switch (currentAnimation) {
                case "Enerve":
                    this._noActionAnimationCount = 0;
                    this.stopMoving();
                    break;
                case "Sauter":
                    this._currentAnimation = null;
                    if(this._sprite.vx > 0) {
                        this.moveRight();
                    } else if(this._sprite.vx < 0) {
                        this.moveLeft();
                    }
                    break;
                case "QuandJeFaisRien":
                    this._noActionAnimationCount++;
                    if (this._noActionAnimationCount >= 5) {
                        this.setAngry();
                    } else {
                        this._currentAnimation = null;
                        this.setAnimation(currentAnimation);
                    }
                    break;
                default:
                    this._currentAnimation = null;
                    this.setAnimation(currentAnimation);
                    break;
            }
        };
        this.stopMoving();
    }

    setAngry() {
        this.getLogger().debug("setAngry");
        this.setAnimation("Enerve");
    }

    stopMoving() {
        this.getLogger().debug("stopMoving");
        this.setAnimation("QuandJeFaisRien");
        this._sprite.vx = 0;
        this._sprite.vy = this.VY_GAP;
    }

    moveRight() {
        if (this._currentAnimation != "Sauter") {
            this.getLogger().debug("moveRight");
            this.setAnimation("Marcher");
            this._sprite.scale.x = 1;
            this._sprite.vx = this.VX_GAP;
        }
    }

    moveLeft() {
        if (this._currentAnimation != "Sauter") {
            this.getLogger().debug("moveLeft");
            this.setAnimation("Marcher");
            this._sprite.scale.x = -1;
            this._sprite.vx = -1 * this.VX_GAP;
        }
    }

    fall() {
        this.getLogger().debug("fall");
        this._sprite.vy = this.VY_GAP;
    }

    jump() {
        if (this._currentAnimation != "Sauter") {
            this.getLogger().debug("jump");
            this.setAnimation("Sauter");
            this._sprite.vy = -1 * this.VY_GAP;
        }
    }

}

export default Player;