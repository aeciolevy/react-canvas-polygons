import Tool from './tool';

const line = { ...Tool };

line.onMouseDown = function onMouseDown(start) {
    console.log('mouse down', start);
    line.state = {
        ...line.state,
        start
    };
    return this;
}

line.draw = function draw(position) {
    // this.ctx.save();
    this.ctx.lineJoin = 'round';
    this.ctx.lineCap = 'round';
    this.ctx.beginPath();
    // this.ctx.lineWidth = item.size;
    // this.ctx.strokeStyle = item.color;
    // this.ctx.globalCompositeOperation = 'source-over';
    this.ctx.moveTo(this.state.start.x, this.state.start.x);
    this.ctx.lineTo(position.x, position.y);
    // this.ctx.closePath();
    // this.ctx.stroke();
    this.ctx.restore();
}

line.onMouseMove = function onMouseMove(position) {
    if (!this.state) return;
    console.log('mouse move: ', position)
    this.draw(position)
}

line.onMouseUp = function onMouseUp(position) {
    this.state = null;
    console.log('mouse up:', position)
    this.ctx.lineTo(position.x, position.y);
    this.ctx.closePath();
    this.ctx.stroke();
}

export default line;
