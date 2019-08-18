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
}

/**
 * @componentName DrawCanvas
 * @description: This is a component to draw
 * shapes on canvas
 */

class DrawCanvas extends React.PureComponent {

    state = {
        pastData: INITIAL_STATE,
        data: INITIAL_STATE,
        canvasData: [],
        polygonId: canvasHandler.uuid(),
        rectangleId: canvasHandler.uuid(),
    }

    componentDidMount() {
        this.ctx = this.canvas.getContext('2d');
        this.tool = tools[this.props.tool] || tools['Line'];
        this.tool.ctx = this.ctx;
        if (this.props.initialData && this.props.imgSrc) {
            this.loadDraw(this.props.initialData);
        }
    }

    componentDidUpdate(prevProps) {
        if (prevProps.tool !== this.props.tool) {
            this.tool = tools[this.props.tool];
            this.tool.ctx = this.ctx;
            this.tool.resetState();
        }
        if (prevProps.imgSrc !== this.props.imgSrc){
            this.loadDraw(this.props.initialData);
        }
    }

    setDefaultTool =  () => {
        this.tool = tools['Line'];
        this.tool.ctx = this.ctx;
        this.tool.resetState();
    }

    onMouseDown = (e) => {
        const { brushSize, color } = this.props;
        const { tool } = this.props;

        this.createNewToolInitialData(tool);
        this.tool.onMouseDown(this.getCursorPosition(e), { brushSize, color, tool });
    }

    createNewToolInitialData = (tool) => {
        const toolId = tool.startsWith('Poly') ? 'polygonId' : 'rectangleId';
        const keyId = `${tool}_${this.state[toolId]}`;
        if (!this.state.data[keyId]) {
            this.setState({ data: { ...this.state.data, [keyId]: [] } });
        }
    }

    onMouseMove = (e) => {
        this.tool.onMouseMove(this.getCursorPosition(e), () => this.setState({ polygonId: canvasHandler.uuid() }));
    }

    onMouseUp = (e) => {
        const newData = this.tool.onMouseUp(
            this.getCursorPosition(e),
            (finish) => this.setState({ rectangleId: canvasHandler.uuid() })
        );
        this.updateData(newData);
    }

    updateData = (dataFromTool) => {
        const { polygonId, rectangleId } = this.state;
        const { tool } = this.props;
        const key = tool === 'Polygon' ? `Polygon_${polygonId}` : `Rectangle_${rectangleId}`;

        // TODO: Refactor, this code to a DRY version
        if (dataFromTool) {
            if (tool === 'Line') {
                this.setState({
                    pastData: { ...this.state.data },
                    data: {
                        ...this.state.data,
                        'Line': [...this.state.data['Line'], dataFromTool.data ]
                    },
                    canvasData: [...this.state.canvasData, dataFromTool.canvas],
                }, () => {
                    this.props.onCompleteDraw && this.props.onCompleteDraw(this.state.data);
                });
            } else {
                const dataToUpdate = key.startsWith('Poly') ?
                    [...this.state.data[key], dataFromTool.data] : [...this.state.data[key], ...dataFromTool.data ];
                this.setState({
                    pastData: { ...this.state.data },
                    data: {
                        ...this.state.data,
                        [key]: dataToUpdate,
                    },
                    canvasData: [...this.state.canvasData, dataFromTool.canvas],
                }, () => {
                    this.props.onCompleteDraw && this.props.onCompleteDraw(this.state.data);
                });
            }
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
        this.setState({ data: INITIAL_STATE, canvasData: [] }, () => {
            this.props.onCompleteDraw && this.props.onCompleteDraw(this.state.data);
        });
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
        const X = 0, Y = 1;
        const START = 0, END = 1;
        // clean the canvas
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        // loop through the data
        data && Object.keys(data).forEach(el => {
            let shape = canvasHandler.getTool(el);
            this.tool = tools[shape];
            this.tool.ctx = this.ctx;
            let elPoints = data[el];
            if (!el.startsWith('Poly')) {
                elPoints.forEach((point) => {
                    this.tool.draw({ x: point[START][X], y: point[START][Y] }, { x: point[END][X], y: point[END][Y] }, false, {
                        options: { brushSize: this.props.brushSize },
                    });
                });
            } else {
                elPoints.forEach((point, index, array) => {
                    const nextPoint = array[index + 1] || array[0];
                    this.tool.draw({ x: point[X], y: point[Y]}, { x: nextPoint[X], y: nextPoint[Y] }, false, { options: {
                        brushSize: this.props.brushSize
                    }});
                });
                this.tool.fillGeometry(elPoints);
            }
        });
        this.setDefaultTool();
        this.setState({ data: {...this.state.data, ...data }});
    }

    render() {
        const { width, height, imgSrc } = this.props;

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
    /**
     * Is the data to be be draw when load the component
     */
    initialData: type.object,
    /**
     * This is a callback function that we be called
     * everytime a shape finish to draw
     */
    onCompleteDraw: type.func,
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
