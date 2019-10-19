import Player from "../classes/Player.js";
import Block from "../classes/Block.js";
import Trash from "../classes/Trash.js";
import Helpers from "../classes/Helpers.js";
import ApplicationManager from "../classes/ApplicationManager.js";
import GamepadManager from "../classes/GamepadManager.js";
import Background from "../classes/Background.js";

export default {

    player: null,
    blocks: [],
    trash: null,
    addBlock: null,
    background: null,

    setup() {
        // background
        this.background = new Background(this._scene);
        // player
        this.player = new Player(this._scene);
        this.player.setInteractive(true);
        this.player.setDraggable(true);
        this.player.setPosition(100, 100);
        // add block
        this.addBlock = new Block(this._scene);
        this.addBlock.setPosition(20, 20);
        this.addBlock.setSize(30, 30);
        this.addBlock.setInteractive(true);
        this.addBlock.getInstance().on("click", (event) => {
            const block = new Block(this._scene);
            this.blocks.push(block);
            block.setInteractive(true);
            block.setDraggable(true);
            block.setPosition(this._scene.pivot.x + 55, 90);
            block.setSize(100, 100);
        });
        // blocks
        for (let i = 0; i < 20; i++) {
            const block = new Block(this._scene);
            this.blocks.push(block);
            block.setInteractive(true);
            block.setDraggable(true);
            block.setPosition((i * 100) + 50, 530);
            block.setSize(100, 100);
        }
        // trash
        this.trash = new Trash(this._scene);
        this.trash.setPosition(1184, 20);
        this.trash.setSize(30, 30);
    },

    beforeEnter(params) {
        // player
        if (params) {
            this.player.setPosition(params.player.x, params.player.y);
        }
    },

    keyPressed(event) {
        switch (event.key) {
            case "ArrowLeft":
                this.player.moveLeft();
                this.background.moveLeft();
                break;
            case "ArrowRight":
                this.player.moveRight();
                this.background.moveRight();
                break;
        }
    },

    keyReleased(event) {
        switch (event.key) {
            case "ArrowLeft":
                this.player.stopMoving();
                this.background.stopMoving();
                break;
            case "ArrowRight":
                this.player.stopMoving();
                this.background.stopMoving();
                break;
            case "ArrowUp":
                this.player.jump();
                break;
            case "p":
                const params = {
                    blocks: [],
                    player: { x: this.player.getInstance().position.x, y: this.player.getInstance().position.y }
                };
                this.blocks.forEach((block, index) => {
                    const blocInstance = block.getInstance();
                    params.blocks.push({ x: blocInstance.position.x, y: blocInstance.position.y, width: blocInstance.width, height: blocInstance.height });
                });
                ApplicationManager.getInstance().setState("play", params);
                break;
        }
    },

    buttonPressed(event) {
        switch (event.index) {
            case 0:
                this.player.jump();
                break;
            case 14:
                this.player.moveLeft();
                this.background.moveLeft();
                break;
            case 15:
                this.player.moveRight();
                this.background.moveRight();
                break;
        }
    },

    buttonReleased(event) {
        switch (event.index) {
            case 14:
            case 15:
                this.player.stopMoving();
                this.background.stopMoving();
                break;
        }
    },

    tick() {
        const playerPivot = Math.max(0, Math.round(this.player.getInstance().position.x - (ApplicationManager.STAGE_W / 2)));
        // move scene
        this._scene.pivot.x = playerPivot;
        // move tools
        this.trash.getInstance().x = ApplicationManager.STAGE_W + playerPivot - 20;
        this.addBlock.getInstance().x = playerPivot + 20;
        // move player
        this.player.move();
        // check player inside stage
        Helpers.bump.contain(this.player.getInstance(), { x: 0, y: 0, width: this._scene.width, height: this._scene.height });
        // check blocks collision
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
        // background
        this.background.getInstance().x = playerPivot;
        if (playerPivot > 0) {
            if (this.player.hasMoved()) {
                this.background.move();
            } else {
                this.background.stopMoving();
            }
        }
    },

    beforeLeave() {

    }
};