import KeyboardManager from "../classes/KeyboardManager.js";
import ApplicationManager from "../classes/ApplicationManager.js";
import Block from "../classes/Block.js";
import Player from "../classes/Player.js";
import Helpers from "../classes/Helpers.js";

export default {

    scene: null,
    keyLeft: null,
    keyRight: null,
    keyUp: null,
    keyS: null,
    keyE: null,
    blocks: [],
    player: null,

    setup(params) {
        this.scene = params.scene;
    },

    beforeEnter(params) {
        // remove all children
        this.scene.removeChildren();
        // add player
        this.player = new Player(this.scene);
        this.player.setPosition(params.player.x, params.player.y);
        // add blocks
        params.blocks.forEach(b => {
            const block = new Block(this.scene);
            this.blocks.push(block);
            block.setPosition(b.x, b.y);
            block.setSize(b.width, b.height);
        });
        // keyboard
        this.keyLeft = KeyboardManager.getInstance().getKey("ArrowLeft");
        this.keyLeft.press = () => {
            this.player.moveLeft();
        };
        this.keyLeft.release = () => {
            this.player.stopMoving();
        };
        this.keyRight = KeyboardManager.getInstance().getKey("ArrowRight");
        this.keyRight.press = () => {
            this.player.moveRight();
        };
        this.keyRight.release = () => {
            this.player.stopMoving();
        };
        this.keyUp = KeyboardManager.getInstance().getKey("ArrowUp");
        this.keyUp.release = () => {
            this.player.jump();
        };
        this.keyS = KeyboardManager.getInstance().getKey("s");
        this.keyS.press = () => {
            this.player.stopMoving();
        };
        this.keyE = KeyboardManager.getInstance().getKey("e");
        this.keyE.press = () => {
            ApplicationManager.getInstance().setState("edit");
        };
    },

    tick() {
        // move player
        this.player.move();
        // check player inside stage
        let collision = null;
        collision = Helpers.bump.contain(this.player.getInstance(), { x: 0, y: 0, width: ApplicationManager.STAGE_W, height: ApplicationManager.STAGE_H });
        if (collision) {
            if (collision.has("left")) {
                console.log("The sprite hit the left");
            }
            if (collision.has("top")) {
                console.log("The sprite hit the top");
            }
            if (collision.has("right")) {
                console.log("The sprite hit the right");
            }
            if (collision.has("bottom")) {
                console.log("The sprite hit the bottom");
            }
        }
        // check block collision
        this.blocks.forEach((block, index) => {
            // check block collision with player
            Helpers.bump.hit(this.player.getInstance(), block.getInstance(), true);
        });
    },

    beforeLeave() {
        // keyboard
        this.keyLeft.unsubscribe();
        this.keyRight.unsubscribe();
        this.keyUp.unsubscribe();
        this.keyS.unsubscribe();
        this.keyE.unsubscribe();
    }

};