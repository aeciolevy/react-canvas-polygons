const Tool = {

    setInitSettings(data) {
        this.state = {
            ...this.state,
            started: true,
            start: data.start,
            canvasData: [],
            options: data.options,
        };
        this.imageData = this.ctx.getImageData(
            0, 0, this.ctx.canvas.width, this.ctx.canvas.height
        );
        this.ctx.lineWidth = data.options.brushSize;
    },

    draw(start, position, isInitSet, data) {
        if (isInitSet === false) {
            this.setInitSettings({ start, options: data.options || {} });
        }
        this.ctx.beginPath();
        this.ctx.moveTo(start.x, start.y);
        this.ctx.lineTo(position.x, position.y);
        /*fill what we have.
         *Context will close the subpath but without marking it as closed*/
        this.ctx.fill();
        this.ctx.stroke();
        this.ctx.closePath();
    },

    onMouseDown() {
        throw new Error('onMouseDown must be implemented.');
    },

    onMouseMove() {
        throw new Error('onMouseMove must be implemented.');
    },

    onMouseUp() {
        throw new Error('onMouseUp must be implemented.');
    },

    createStartPoint(start, radius = 5) {
        const circle = new Path2D();
        circle.arc(start.x, start.y, radius, 0, 2 * Math.PI);
        if (this.ctx) {
            this.ctx.fillStyle = 'rgba(255, 0, 0, 0.5)';
            this.ctx.fill(circle);
        }
        return circle;
    },

    closePath() {
        if (this.ctx) {
            this.ctx.closePath();
        }
    },

    resetState() {
        this.state = null;
    }
}

export default Tool;
