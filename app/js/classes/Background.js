import Sprite from "./Sprite.js";
import ResourcesManager from "./ResourcesManager.js";

class Background extends Sprite {

    constructor(container) {
        super(container, [ResourcesManager.getInstance().getTexture("resources/imgs/platformer_background_4.png")]);
        this.VX_GAP = 5;
    }

    move() {
        this._sprite.tilePosition.x -= this._sprite.vx;
        this._sprite.tilePosition.y += this._sprite.vy;
    }

    stopMoving() {
        this._sprite.vx = 0;
    }

    moveRight() {
        this._sprite.vx = this.VX_GAP;
    }

    moveLeft() {
        this._sprite.vx = -1 * this.VX_GAP;
    }

    _getNewInstance() {
        const texture = this._textures[0];
        return new PIXI.TilingSprite(texture, texture.baseTexture.width, texture.baseTexture.height);
    }
}

export default Background;