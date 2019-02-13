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
    Polygon: {},
    Line: [],
    Rectangle: [],
}

class DrawCanvas extends React.PureComponent {

    state = {
        pastData: INITIAL_STATE,
        data: INITIAL_STATE,
        canvasData: [],
        tool: 'Line',
        polygonId: canvasHandler.uuid(),
    }

    componentDidMount() {
        this.ctx = this.canvas.getContext('2d');
        this.tool = tools[this.props.tool] || tools['Line'];
        this.tool.ctx = this.ctx;
        this.setState({ data: {
            ...this.state.data,
            'Polygon': { [this.state.polygonId]: []}
        } });
    }

    componentDidUpdate(prevProps) {
        if (prevProps.tool !== this.props.tool) {
            this.tool = tools[this.props.tool];
            this.tool.ctx = this.ctx;
            this.tool.resetState();
        }
    }

    onMouseDown = (e) => {
        const { brushSize, color } = this.props;
        const { tool } = this.state;
        this.tool.onMouseDown(this.getCursorPosition(e), { brushSize, color, tool });
    }

    onMouseMove = (e) => {
        this.tool.onMouseMove(this.getCursorPosition(e), (data, startPoint) => {
            const correctData = this.correctPolygon(data, startPoint);
            this.updateData(correctData);
            this.setState({ polygonId: canvasHandler.uuid() }, (parameters) => {
                this.setState({ data: {
                    ...this.state.data,
                    'Polygon': { ...this.state.data['Polygon'], [this.state.polygonId] : []}
                }})
            });
            this.tool.resetState();
        })
    }

    correctPolygon = (data, startPoint) => {
        const lData = {...data};
        const END = 1;
        lData.canvas.end = startPoint;
        lData.data[END] = startPoint;
        return lData;
    }

    onMouseUp = (e) => {
        const newData = this.tool.onMouseUp(this.getCursorPosition(e));
        this.updateData(newData);
    }

    updateData = (data) => {
        const { polygonId } = this.state;
        const { tool } = this.props;
        if (data) {
            this.setState({
                pastData: { ...this.state.data },
                data: {
                    ...this.state.data,
                    [tool]: tool === 'Polygon' ?
                    { ...this.state.data[tool],
                        [polygonId]: [...this.state.data[tool][polygonId], data.data ]
                    }
                    :
                    [...this.state.data[tool], data.data]
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
            y: e.clientY - top,
            x: e.clientX - left,
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
                    this.tool = tools[tool];
                    this.tool.draw(el.start, el.end, false, { options: el.options});
                });
            });
        }
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
    width: type.string,
    /**
     * the height of the canvas
     */
    height: type.string,
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
