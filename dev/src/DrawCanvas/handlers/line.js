import Tool from './tool';
export const LINE = 'Line';

const line = { ...Tool };

line.name = 'Line';

line.onMouseDown = function onMouseDown(start, options) {
    this.ctx.strokeStyle = options ? options.color : "#000";
    this.setInitSettings({ start, options });
    if (!this.state.data) {
        // get the start point on mouse down
        // TODO: it is not the best solution
        // revisit later
        this.state.firstMouseDown = start;
        this.state.data = [];
    }
}

line.onMouseMove = function onMouseMove(position) {
    if (!this.state || !this.state.started) return;
    this.ctx.putImageData(this.imageData, 0, 0);
    this.draw(this.state.start, position);
}

// see #3
// Change mechanism to draw line
line.onMouseUp = function onMouseUp(position, callback) {
    if (!this.state) return;
    // NOTE: This state data is just to avoid draw in
    // the first mouse up
    this.state.data.push([position.x, position.y]);
    if (this.state.data.length > 1) {
        const data = [[this.state.firstMouseDown.x, this.state.firstMouseDown.y], [position.x, position.y]];
        const start = this.state.start;
        const options = this.state.options;
        this.drawCrossDirection(this.state.data, 10);
        this.resetState();
        callback();
        return {
            data: data,
            canvas: {
                start,
                end: position,
                options
            }
        };
    }
}

function getCrossPath(point, size, direction) {
    const path = new Path2D();
    const startHorizontalLine = { x: point.x - size, y: point.y };
    const endHorizontalLine = { x: point.x + size, y: point.y };
    const startVerticalLine = { x: point.x, y: point.y - size };
    const endVerticalLine = { x: point.x, y: point.y + size };

    path.moveTo(startHorizontalLine.x, startHorizontalLine.y);
    path.lineTo(endHorizontalLine.x, endHorizontalLine.y);
    path.moveTo(startVerticalLine.x, startVerticalLine.y);
    path.lineTo(endVerticalLine.x, endVerticalLine.y);
    return path;
}

/* Xt = (X1+X2)/2 + M * sign(Y2-Y1)
Yt = (Y1+Y2)/2 - M * sign(X2-X1) */
line.drawCrossDirection = function (points, pixelDistance) {
    const x1 = points[0][0];
    const x2 = points[1][0];
    const y1 = points[0][1];
    const y2 = points[1][1];

    const xCoord = ((x1 + x2) / 2) + (pixelDistance * Math.sign(y2 - y1));
    const yCoord = ((y1 + y2) / 2) - (pixelDistance * Math.sign(x2 - x1));

    const crossPath = getCrossPath({x: xCoord, y: yCoord }, 6);
    this.ctx.strokeStyle = '#ff0000';
    this.ctx.stroke(crossPath);
    this.ctx.strokeStyle = '#000';
}

export default line;
