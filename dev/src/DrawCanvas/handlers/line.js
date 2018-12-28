import Tool from './tool';

const line = { ...Tool };

line.onMouseDown = function onMouseDown(start) {
    this.state = {
        started: true,
        start,
    };
    this.imageData = this.ctx.getImageData(0, 0, this.ctx.canvas.width, this.ctx.canvas.height);
    return this;
}

line.draw = function draw(position) {
    this.ctx.beginPath();
    this.ctx.moveTo(this.state.start.x, this.state.start.y);
    this.ctx.lineTo(position.x, position.y);
    this.ctx.stroke();
    this.ctx.closePath();
}

line.onMouseMove = function onMouseMove(position) {
    if (!this.state || !this.state.started) return;
    this.ctx.putImageData(this.imageData, 0, 0);
    this.draw(position)
}

line.onMouseUp = function onMouseUp(position) {
    if (!this.state) return;
    this.onMouseMove(position);
    this.resetState();
}

export default line;
