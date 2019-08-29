import React from 'react';
import type from 'prop-types';
import Line from './handlers/line';
import Polygon from './handlers/polygon';
import Rectangle from './handlers/rectangle';
import canvasHandler from './handlers/canvasHandler';
import History from './handlers/history';

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
        undoData: [],
        redoData: [],
        data: INITIAL_STATE,
        canvasData: [],
        polygonId: canvasHandler.uuid(),
        rectangleId: canvasHandler.uuid(),
    }

    componentDidMount() {
        this.ctx = this.canvas.getContext('2d');
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

    onMouseDown = (e) => {
        if (this.tool) {
            const { brushSize, color } = this.props;
            const { tool } = this.props;
            const { polygonId, rectangleId } = this.state;
            if (tool !== 'Line') {
                this.createNewToolInitialData(tool);
            }
            const key = tool === 'Line' ? 'Line' : tool === 'Polygon' ? `Polygon_${polygonId}` : `Rectangle_${rectangleId}`;
            this.setState({ currentKey: key });
            this.tool.onMouseDown(this.getCursorPosition(e), { brushSize, color, tool });
        }
    }

    createNewToolInitialData = (tool) => {
        const toolId = tool.startsWith('Poly') ? 'polygonId' : 'rectangleId';
        const keyId = `${tool}_${this.state[toolId]}`;
        if (!this.state.data[keyId]) {
            this.setState({ data: { ...this.state.data, [keyId]: [] } });
        }
    }

    onMouseMove = (e) => {
        if (this.tool) {
            this.tool.onMouseMove(this.getCursorPosition(e), () =>
            {
                this.setState({ polygonId: canvasHandler.uuid(), currentKey: null });
                this.tool = null;
                this.props.onFinishDraw();
            });
        }
    }

    onMouseUp = (e) => {
        if (this.tool) {
            const newData = this.tool.onMouseUp(
                this.getCursorPosition(e),
                () => {
                    this.setState({ rectangleId: canvasHandler.uuid(), currentKey: null });
                    this.tool = null;
                    this.props.onFinishDraw && this.props.onFinishDraw();
                }
            );
            this.updateData(newData);
        }
    }

    updateData = (dataFromTool) => {
        const { polygonId, rectangleId } = this.state;
        const { tool } = this.props;
        const key = tool === 'Line' ? 'Line' : tool === 'Polygon' ? `Polygon_${polygonId}` : `Rectangle_${rectangleId}`;
        // TODO: Refactor, this code to a DRY version
        if (dataFromTool) {
            const dataToUpdate = key.startsWith('Poly') || key.startsWith('Line') ?
                [...this.state.data[key], dataFromTool.data] : [...this.state.data[key], ...dataFromTool.data];

            this.setState({
                undoData: [...this.state.undoData, this.state.data],
                data: {
                    ...this.state.data,
                    [key]: dataToUpdate,
                },
                canvasData: [...this.state.canvasData, dataFromTool.canvas],
            }, () => {
                this.props.onDataUpdate && this.props.onDataUpdate(this.state.data);
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
        this.setState({ data: INITIAL_STATE, canvasData: [] }, () => {
            this.props.onDataUpdate && this.props.onDataUpdate(this.state.data);
        });
    }

    isCtrlPressed = (event) => event.ctrlKey || event.metaKey;
    isShiftPressed = (event) => event.shiftKey;

    onKeyDown = (event) => {
        const isCtrl = this.isCtrlPressed(event);
        const isShift = this.isShiftPressed(event);
        const Z = 90;
        if (isCtrl && event.which === Z) {
            const modifiedUndo = this.state.undoData;
            const oneStepBack = modifiedUndo.pop()
            this.loadDraw(oneStepBack, true);
            this.setState({ data: oneStepBack, undoData: modifiedUndo, redoData: [...this.state.redoData, this.state.data] });
        }
        if (isCtrl && isShift && event.which === Z) {
            console.log('redo');
            const modifiedRedo = this.state.redoData;
            const oneStepForward = modifiedRedo.pop();
            this.loadDraw(oneStepForward, true);
            this.setState({ data: oneStepForward });
        }
    }

    onKeyUp = (event) => {
        if (event.key === 'Escape') {
            // undo current drawing
            if (this.state.currentKey) {
                let newData = History.cancel(this.state.currentKey, this.state.data);
                this.setState({ data: newData, currentKey: null }, () => {
                    this.loadDraw(this.state.data, true);
                    this.props.onDataUpdate(this.state.data);
                    this.tool = null;
                });
            }
        };
    }

    // TODO: refactor this function to canvas handle
    loadDraw = (data, byPassReset) => {
        const X = 0, Y = 1;
        const START = 0, END = 1;
        const TOP_LEFT = 0, BOTTOM_RIGHT = 2;
        // clean the canvas
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        // loop through the data
        data && Object.keys(data).forEach(el => {
            let shape = canvasHandler.getTool(el);
            this.tool = tools[shape];
            this.tool.ctx = this.ctx;
            if (el.startsWith('Rectan')) {
                data[el] = [data[el][TOP_LEFT], data[el][BOTTOM_RIGHT]];
            }
            let elPoints = data[el];
            if (el.startsWith('Line') || el.startsWith('Arrang')) {
                elPoints.forEach((point) => {
                    this.tool.draw({ x: point[START][X], y: point[START][Y] }, { x: point[END][X], y: point[END][Y] }, false, {
                        options: { brushSize: this.props.brushSize },
                    });
                });
            } else {
                elPoints.forEach((point, index, array) => {
                    const nextPoint = el.startsWith('Rect') ? array[index + 1] : (array[index + 1] || array[0]);
                    if (nextPoint) {
                        this.tool.draw({ x: point[X], y: point[Y]}, { x: nextPoint[X], y: nextPoint[Y] }, false, { options: {
                            brushSize: this.props.brushSize
                        }});
                    }
                });
                if (el.startsWith('Poly')) {
                    this.tool.fillGeometry(elPoints);
                }
            }
        });
        this.tool.resetState();
        this.tool = null;
        this.props.onFinishDraw();
        if (!byPassReset) {
            // this.setDefaultTool();
            this.setState({ data: {...this.state.data, ...data }});
        }
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
                    onKeyDown={this.onKeyDown}
                    onKeyUp={this.onKeyUp}
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
     * everytime the data updates
     */
    onDataUpdate: type.func,
    /**
     * This is a callback function what we be triggered
     * when the shape is drawn
     */
    onFinishDraw: type.func
}

DrawCanvas.defaultProps = {
    width: 300,
    height: 300,
    brushSize: 2,
    color: '#000000',
    canUndo: false,
}

export default DrawCanvas;
