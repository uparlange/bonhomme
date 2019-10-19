import ApplicationManager from "../classes/ApplicationManager.js";
import Block from "../classes/Block.js";
import Player from "../classes/Player.js";
import Helpers from "../classes/Helpers.js";
import ResourcesManager from "../classes/ResourcesManager.js";

export default {

    blocks: [],
    player: null,
    beetlejuiceSound: null,
    sceneWidth: null,

    setup() {

    },

    beforeEnter(params) {
        // sound
        this.beetlejuiceSound = ResourcesManager.getInstance().getSound("beetlejuice");
        this.beetlejuiceSound.play();
        // remove all children
        this._scene.removeChildren();
        // add player
        this.player = new Player(this._scene);
        this.player.setPosition(params.player.x, params.player.y);
        // add blocks
        params.blocks.forEach(b => {
            const block = new Block(this._scene);
            this.blocks.push(block);
            block.setPosition(b.x, b.y);
            block.setSize(b.width, b.height);
        });
        // save scene width
        this._sceneWidth = this._scene.width;
    },

    keyPressed(event) {
        switch (event.key) {
            case "ArrowLeft":
                this.player.moveLeft();
                break;
            case "ArrowRight":
                this.player.moveRight();
                break;
        }
    },

    keyReleased(event) {
        switch (event.key) {
            case "ArrowLeft":
                this.player.stopMoving();
                break;
            case "ArrowRight":
                this.player.stopMoving();
                break;
            case "ArrowUp":
                this.player.jump();
                break;
            case "e":
                ApplicationManager.getInstance().setState("edit", {
                    player: { x: this.player.getInstance().position.x, y: this.player.getInstance().position.y }
                });
                break;
        }
    },

    tick() {
        // move player
        this.player.move();
        // move scene
        let playerPivot = Math.round(this.player.getInstance().position.x - (ApplicationManager.STAGE_W / 2));
        const minPivot = 0;
        const maxPivot = this._sceneWidth - ApplicationManager.STAGE_W;
        if (playerPivot <= minPivot) {
            playerPivot = minPivot;
        }
        if (playerPivot >= maxPivot) {
            playerPivot = maxPivot;
        }
        this._scene.pivot.x = playerPivot;
        // check player inside stage
        let collision = null;
        collision = Helpers.bump.contain(this.player.getInstance(), { x: 0, y: 0, width: this._sceneWidth, height: ApplicationManager.STAGE_H });
        if (collision) {
            if (collision.has("left")) {
                this.getLogger().debug("The sprite hit the left");
            }
            if (collision.has("top")) {
                this.getLogger().debug("The sprite hit the top");
            }
            if (collision.has("right")) {
                this.getLogger().debug("The sprite hit the right");
            }
            if (collision.has("bottom")) {
                this.getLogger().debug("The sprite hit the bottom");
            }
        }
        // check block collision
        this.blocks.forEach((block, index) => {
            // check block collision with player
            Helpers.bump.hit(this.player.getInstance(), block.getInstance(), true);
        });
    },

    beforeLeave() {
        // sound
        this.beetlejuiceSound.stop();
    }

};