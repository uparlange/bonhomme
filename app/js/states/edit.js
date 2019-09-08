import KeyboardManager from "../classes/KeyboardManager.js";
import Player from "../classes/Player.js";
import Block from "../classes/Block.js";
import Trash from "../classes/Trash.js";
import Helpers from "../classes/Helpers.js";
import ApplicationManager from "../classes/ApplicationManager.js";
import GamepadManager from "../classes/GamepadManager.js";

export default {

    scene: null,
    player: null,
    keyLeft: null,
    keyRight: null,
    keyUp: null,
    keyS: null,
    keyP: null,
    blocks: [],
    trash: null,

    setup(params) {
        this.scene = params.scene;
        // player
        this.player = new Player(this.scene);
        this.player.setInteractive(true);
        this.player.setPosition(620, 100);
        // add block
        const addBlock = new Block(this.scene);
        addBlock.setPosition(20, 20);
        addBlock.setSize(30, 30);
        addBlock.setInteractive(true);
        addBlock.getInstance().on("click", (event) => {
            const block = new Block(this.scene);
            this.blocks.push(block);
            block.setInteractive(true);
            block.setPosition(55, 90);
            block.setSize(100, 100);
        });
        // blocks
        for (let i = 0; i < 13; i++) {
            const block = new Block(this.scene);
            this.blocks.push(block);
            block.setInteractive(true);
            block.setPosition((i * 100) + 50, 530);
            block.setSize(100, 100);
        }
        // trash
        this.trash = new Trash(this.scene);
        this.trash.setPosition(1184, 20);
        this.trash.setSize(30, 30);
    },

    beforeEnter(params) {
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
        this.keyP = KeyboardManager.getInstance().getKey("p");
        this.keyP.press = () => {
            const params = {
                blocks: [],
                player: { x: this.player.getInstance().position.x, y: this.player.getInstance().position.y }
            };
            this.blocks.forEach((block, index) => {
                const blocInstance = block.getInstance();
                params.blocks.push({ x: blocInstance.position.x, y: blocInstance.position.y, width: blocInstance.width, height: blocInstance.height });
            });
            ApplicationManager.getInstance().setState("play", params);
        };
        // gamepad
        this._gamepadButtonPressed = (event) => {
            switch (event.index) {
                case 0:
                    this.player.jump();
                    break;
                case 14:
                    this.player.moveLeft();
                    break;
                case 15:
                    this.player.moveRight();
                    break;
            }
        };
        GamepadManager.getInstance().events.on("buttonPressed", this._gamepadButtonPressed);
        this._gamepadButtonReleased = (event) => {
            switch (event.index) {
                case 14:
                case 15:
                    this.player.stopMoving();
                    break;
            }
        };
        GamepadManager.getInstance().events.on("buttonReleased", this._gamepadButtonReleased);
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
            // check block collision with trash
            if (Helpers.bump.hit(this.trash.getInstance(), block.getInstance())) {
                // remove from list
                this.blocks.splice(index, 1);
                // remove from stage
                block.remove();
            }
        });
    },

    beforeLeave() {
        // keyboard
        this.keyLeft.unsubscribe();
        this.keyRight.unsubscribe();
        this.keyUp.unsubscribe();
        this.keyS.unsubscribe();
        this.keyP.unsubscribe();
        // gamepad
        GamepadManager.getInstance().events.off("buttonPressed", this._gamepadButtonPressed);
        GamepadManager.getInstance().events.off("buttonReleased", this._gamepadButtonReleased);
    }
};