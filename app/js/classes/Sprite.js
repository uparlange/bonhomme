class Sprite {

    constructor(container, textures) {
        this._container = container;
        this._textures = textures;
        this._draggable = false;
        this._sprite = this._getNewInstance();
        this._sprite.vx = 0;
        this._sprite.vy = 0;
        this._sprite.anchor.set(0.5);
        // events for drag start
        this._sprite.on("mousedown", (event) => {
            this._onDragStart(event);
        });
        this._sprite.on("touchstart", (event) => {
            this._onDragStart(event);
        });
        // events for drag end
        this._sprite.on("mouseup", (event) => {
            this._onDragEnd(event);
        });
        this._sprite.on("mouseupoutside", (event) => {
            this._onDragEnd(event);
        });
        this._sprite.on("touchend", (event) => {
            this._onDragEnd(event);
        });
        this._sprite.on("touchendoutside", (event) => {
            this._onDragEnd(event);
        });
        // events for drag move
        this._sprite.on("mousemove", (event) => {
            this._onDragMove(event);
        });
        this._sprite.on("touchmove", (event) => {
            this._onDragMove(event);
        });
        this.add();
    }

    add() {
        this._container.addChild(this._sprite);
    }

    remove() {
        this._container.removeChild(this._sprite);
    }

    setSize(w, h) {
        if (w) {
            this._sprite.width = w;
        }
        if (h) {
            this._sprite.height = h;
        }
    }

    setDraggable(b) {
        this._draggable = b;
    }

    setInteractive(b) {
        this._sprite.interactive = b;
    }

    setPosition(x, y) {
        this._sprite.position.set(x, y);
    }

    move() {
        this._sprite.x += this._sprite.vx;
        this._sprite.y += this._sprite.vy;
    }

    getInstance() {
        return this._sprite;
    }

    _onDragStart(event) {
        if (this._draggable) {
            // store a reference to the data
            // the reason for this is because of multitouch
            // we want to track the movement of this particular touch
            this._sprite.data = event.data;
            this._sprite.alpha = 0.5;
            this._sprite.dragging = true;
        }
    }

    _onDragEnd() {
        this._sprite.alpha = 1;
        this._sprite.dragging = false;
        // set the interaction data to null
        this._sprite.data = null;
    }

    _onDragMove() {
        if (this._sprite.dragging) {
            var newPosition = this._sprite.data.getLocalPosition(this._sprite.parent);
            this.setPosition(newPosition.x, newPosition.y);
        }
    }

    _getNewInstance() {
        return new PIXI.Sprite(this._textures[0]);
    }
}

export default Sprite;