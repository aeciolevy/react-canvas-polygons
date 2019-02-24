import React from 'react';
import type from 'prop-types';
import Line from './handlers/line';
import Polygon from './handlers/polygon';
import Rectangle from './handlers/rectangle';
import canvasHandler from './handlers/canvasHandler';

const tools = {
    'Line': Line,
    'Polygon': Polygon,
    'Rectangle': Rectangle,
};

const INITIAL_STATE = {
    Line: [],
    Rectangle: [],
}

class DrawCanvas extends React.PureComponent {

    state = {
        pastData: INITIAL_STATE,
        data: INITIAL_STATE,
        canvasData: [],
        polygonId: canvasHandler.uuid(),
    }

    componentDidMount() {
        this.ctx = this.canvas.getContext('2d');
        this.tool = tools[this.props.tool] || tools['Line'];
        this.setState({ data: { ...this.state.data, [`Polygon_${this.state.polygonId}`]: [] }})
        this.tool.ctx = this.ctx;
        if (this.props.startDraw) {
            this.loadDraw(this.props.startDraw);
        }
    }

    componentDidUpdate(prevProps) {
        if (prevProps.tool !== this.props.tool) {
            this.tool = tools[this.props.tool];
            this.tool.ctx = this.ctx;
            this.tool.resetState();
        }
    }

    setDefaultTool =  () => {
        this.tool = {...this.tool, ...tools['Line'] };
    }

    onMouseDown = (e) => {
        const { brushSize, color } = this.props;
        const { tool } = this.props;
        this.tool.onMouseDown(this.getCursorPosition(e), { brushSize, color, tool });
    }

    onMouseMove = (e) => {
        this.tool.onMouseMove(this.getCursorPosition(e), (data, startPoint) => {
            this.setState({ polygonId: canvasHandler.uuid() }, () => {
                // Create another polygon ID to track the news polygons
                this.setState({ data: {
                    ...this.state.data,
                    [`Polygon_${this.state.polygonId}`]: [],
                }});
            });
            this.tool.resetState();
        })
    }

    correctPolygon = (data, startPoint) => {
        const lData = {...data};
        lData.canvas.end = startPoint;
        lData.data[1] = [startPoint.x, startPoint.y];
        return lData;
    }

    onMouseUp = (e) => {
        const newData = this.tool.onMouseUp(this.getCursorPosition(e));
        this.updateData(newData);
    }

    updateData = (data) => {
        const { polygonId } = this.state;
        const { tool } = this.props;
        const key = tool === 'Polygon' ? `Polygon_${polygonId}` : tool
        if (data) {
            this.setState({
                pastData: { ...this.state.data },
                data: {
                    ...this.state.data,
                    [key]: [...this.state.data[key], data.data ]
                },
                canvasData: [...this.state.canvasData, data.canvas],
            }, () => {
                this.props.onCompleteDraw && this.props.onCompleteDraw(this.state.data);
            });
        }
    }

    getCursorPosition = (e) => {
        // top and left of canvas
        const { top, left } = this.canvas.getBoundingClientRect();
        // clientY and clientX coordinate inside the element that the event occur.
        return {
            x: Math.round(e.clientX - left),
            y: Math.round(e.clientY - top),
        }
    }

    cleanCanvas = () => {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        this.setState({ data: INITIAL_STATE, canvasData: [] });
    }

    undo = () => {
        if (this.props.canUndo) {
            let tempCanvasData = [...this.state.canvasData];
            tempCanvasData.pop();
            this.setState({
                data: { ...this.state.pastData },
                canvasData: [...tempCanvasData]
            }, () => {
                this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
                this.state.canvasData.forEach(el => {
                    const { tool } = el.options;
                    this.tool = { ...this.tool, ...tools[tool] };
                    this.tool.draw(el.start, el.end, false, { options: el.options});
                });
            });
        }
    }

    loadDraw = (data) => {
        // clean the canvas
        const X = 0, Y = 1;
        const START = 0, END = 1;
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        // loop through the data
        Object.keys(data).forEach(el => {
            let shape = canvasHandler.getTool(el);
            this.tool = {...this.tool, ...tools[shape]};
            let elPoints = data[el];
            if (!el.startsWith('Poly')) {
                elPoints.forEach((point) => {
                    this.tool.draw({ x: point[START][X], y: point[START][Y] }, { x: point[END][X], y: point[END][Y] }, false, {
                        options: { brushSize: this.props.brushSize },
                    });
                })
            }
            else {
                elPoints.forEach((point, index, array) => {
                    const nextPoint = array[index + 1] || array[0];
                    this.tool.draw({ x: point[START][X], y: point[START][Y]}, { x: nextPoint[START][X], y: nextPoint[START][Y] }, false, { options: {
                        brushSize: this.props.brushSize
                    }});
                    if (!array[index + 1]) {
                        this.tool.ctx.fillStyle = 'rgba(12, 193, 31, 0.25)';
                        this.tool.ctx.fill();
                    }
                });
            }
        });
        this.tool.resetState();
        this.setDefaultTool();
        // this.setState({ data: { Polygon: }})
    }

    render() {
        const { width, height, imgSrc, canUndo } = this.props;

        return(
            <React.Fragment>
                <canvas tabIndex="1"
                    ref={canvas => this.canvas = canvas} width={width} height={height}
                    style={{ color: 'black',
                        backgroundImage: `url(${imgSrc})`,
                        backgroundSize: 'cover'
                    }}
                    onMouseDown={this.onMouseDown}
                    onMouseMove={this.onMouseMove}
                    onMouseUp={this.onMouseUp}
                />
            </React.Fragment>
        );
    }
}

DrawCanvas.propTypes = {
    /**
     * The width of canvas
     */
    width: type.number,
    /**
     * the height of the canvas
     */
    height: type.number,
    /**
     * Background image to canvas;
     */
    imgSrc: type.string,
    /**
     * BrushSize to draw
     */
    brushSize: type.number,
    /**
     * Color of what we want draw
     */
    color: type.string,
    /**
     * CanUndo
     */
    canUndo: type.bool,
    /**
     * Shapes that you can select to draw
     */
    tool: type.oneOf(['Line', 'Polygon', 'Rectangle']),
    loadDraw: type.object,
}

DrawCanvas.defaultProps = {
    width: 300,
    height: 300,
    brushSize: 2,
    color: '#000000',
    tool: 'Line',
    canUndo: false,
}

export default DrawCanvas;
