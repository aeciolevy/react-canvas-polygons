import Tool from './tool';
export const LINE = 'Line';
const line = { ...Tool };

line.onMouseDown = function onMouseDown(start, options) {
    this.state = {
        started: true,
        start,
    };
    this.imageData = this.ctx.getImageData(0, 0, this.ctx.canvas.width, this.ctx.canvas.height);
    this.ctx.lineWidth = options.brushSize;
    this.ctx.strokeStyle = options.tool === 'Line' && options.color;
    return this;
}

line.draw = function draw(position) {
    this.ctx.beginPath();
    this.ctx.moveTo(this.state.start.x, this.state.start.y);
    this.ctx.lineTo(position.x, position.y);
    /*fill what we have.
     *Context will close the subpath but without marking it as closed*/
    this.ctx.fill();
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
    this.data = [this.state.start, position];
    this.resetState();
    return this.data;
}

export default line;
