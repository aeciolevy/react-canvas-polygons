import Tool from './tool';
export const POLYGON = 'Polygon';

const polygon = { ...Tool };

polygon.name = 'Polygon';

polygon.onMouseDown = function onMouseDown(start, options) {
    if (!this.state) {
        this.state = {
            ...this.state,
            initialCircle: this.createStartPoint(start, 5),
            startPoint: start
        };
    }
    if (!this.state.pathData) {
        this.state.pathData = [];
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
        && this.state.canvasData.length > 0 && this.state.pathData.length >= 3) {
            // the idea is to reconstructed the path using this.state.pathData here
            // so we can fill it out.
            this.fillGeometry(this.state.pathData);
            this.resetState();
            // This callback is just to
            // sinalize we finish to draw and
            // we should create another polygon ID
            // to track the data
            callback();
    }
}

polygon.fillGeometry = function fillGeometry (pathData) {
    const path = new Path2D();
    const startPoint = pathData[0][0];
    path.moveTo(startPoint[0], startPoint[1]);
    pathData.forEach((el, index) => {
        if (pathData[index + 1]) {
            path.lineTo(pathData[index + 1][0], pathData[index + 1][1])
        } else {
            path.lineTo(pathData[0][0], pathData[0][1]);
        }
    });
    this.ctx.fillStyle = 'rgba(255, 0, 0, 0.1)';
    this.ctx.fill(path);
}

polygon.onMouseUp = function onMouseUp(position) {
    if (!this.state) return;
    const data = [this.state.start.x, this.state.start.y];
    this.state.pathData.push(data);
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
