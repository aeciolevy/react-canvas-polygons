import Tool from './tool';

const rectangle = { ...Tool };

rectangle.onMouseDown = function onMouseDown(start, options) {
    this.ctx.strokeStyle = options.color;
    this.ctx.fillStyle = 'rgba(255,0,0, 0.1)';
    this.ctx.lineWidth = 5;
    this.setInitSettings({ start, options });
    return this;
}

rectangle.draw = function draw(start, position, isInitSet, data, type = 'rectangle') {
    if (isInitSet === false) {
        this.ctx.fillStyle = 'rgba(255,0,0, 0.1)';
        this.ctx.lineWidth = 5;
        this.setInitSettings({ start, options: data.options })
    }
    this.ctx.stroke();
    this.ctx.fillRect(start.x, start.y, position.x - start.x, position.y - start.y);
    this.ctx.strokeRect(start.x, start.y, position.x - start.x, position.y - start.y);
}

rectangle.onMouseMove = function onMouseMove(position) {
    if (!this.state || !this.state.started) return;
    this.ctx.putImageData(this.imageData, 0, 0);
    this.draw(this.state.start, position);
}

rectangle.onMouseUp = function onMouseUp(position) {
    if (!this.state) return;
    const data = {start: this.state.start, end: position };
    const start = this.state.start;
    const options = this.state.options;
    this.state.started = false;
    return {
        data: data,
        canvas: {
            start,
            end: position,
            options,
        }
    }
}

export default rectangle;
