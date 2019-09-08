import Sprite from "./Sprite.js";
import ResourcesManager from "./ResourcesManager.js";

class Block extends Sprite {

    constructor(container) {
        super(container, [ResourcesManager.getInstance().getTexture("resources/svgs/BlockFichier 1.svg")]);
    }
}

export default Block;