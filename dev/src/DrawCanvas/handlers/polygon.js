import Tool from './tool';
export const POLYGON = 'Polygon';

const polygon = { ...Tool };

polygon.onMouseDown = function onMouseDown(start, options) {
    if (!this.state) {
        this.state = {
            ...this.state,
            initialCircle: this.createStartPoint(start, 5),
            startPoint: start
        };
    }
    this.ctx.fillStyle = options.color;
    this.setInitSettings({ start, options });
}

polygon.onMouseMove = function onMouseMove(position, callback) {
    if (!this.state || !this.state.started) return;
    this.ctx.putImageData(this.imageData, 0, 0);
    this.draw(this.state.start, position);
    // check canvas data to ensure that algorithm started
    // to be drawn
    if (this.ctx.isPointInPath(this.state.initialCircle, position.x, position.y)
        && this.state.canvasData.length > 0){
        this.state.started = false;
        callback && callback({
            data: [[this.state.start.x, this.state.start.y], [position.x, position.y]],
            canvas: {
                start: this.state.start,
                end: position,
                options: this.state.options,
            }
        }, this.state.startPoint);
    }
}

polygon.onMouseUp = function onMouseUp(position) {
    if (!this.state) return;
    const data = [this.state.start.x, this.state.start.y];
    this.state.canvasData.push(data);
    const start = this.state.start;
    const options = this.state.options;
    return {
        data: data,
        canvas: {
            start,
            end: position,
            options
        }
    };
}

export default polygon;
