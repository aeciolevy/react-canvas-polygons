import Tool from './tool';
export const LINE = 'Line';

const line = { ...Tool };

line.onMouseDown = function onMouseDown(start, options) {
    this.ctx.strokeStyle = options.color;
    this.setInitSettings({ start, options });
    return this;
}

line.onMouseMove = function onMouseMove(position) {
    if (!this.state || !this.state.started) return;
    this.ctx.putImageData(this.imageData, 0, 0);
    this.draw(this.state.start, position);
}

line.onMouseUp = function onMouseUp(position) {
    if (!this.state) return;
    const data = [this.state.start, position];
    const start = this.state.start;
    const options = this.state.options;
    this.resetState();
    return {
        data: data,
        canvas: {
            start,
            end: position,
            options
        }
    };
}

export default line;
