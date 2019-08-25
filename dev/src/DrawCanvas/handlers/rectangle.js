import Tool from './tool';

const rectangle = { ...Tool };

rectangle.name = 'Rectangle'

rectangle.onMouseDown = function onMouseDown(start, options) {
    this.ctx.strokeStyle = options.color;
    this.ctx.fillStyle = 'rgba(255,0,0, 0.1)';
    this.ctx.lineWidth = 5;
    this.setInitSettings({ start, options });
}

rectangle.draw = function draw(start, position, isInitSet, data) {
    if (isInitSet === false) {
        this.ctx.fillStyle = 'rgba(255,0, 0, 0.1)';
        this.ctx.lineWidth = 5;
        this.setInitSettings({ start, options: data.options })
    }
    this.ctx.fillRect(start.x, start.y, position.x - start.x, position.y - start.y);
    this.ctx.strokeRect(start.x, start.y, position.x - start.x, position.y - start.y);
}

rectangle.onMouseMove = function onMouseMove(position) {
    if (!this.state || !this.state.started) return;
    this.ctx.putImageData(this.imageData, 0, 0);
    this.draw(this.state.start, position);
}

rectangle.onMouseUp = function onMouseUp(position, callback) {
    if (!this.state) return;
    const data = [
        [this.state.start.x, this.state.start.y],
        [this.state.start.x, position.y],
        [position.x, position.y],
        [position.x, this.state.start.y]
    ];
    const start = this.state.start;
    const options = this.state.options;
    this.state.started = false;
    // this callback is just to trigger a new
    // Rectangle ID
    callback();
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
