import React from 'react';
import type from 'prop-types';
import imageHandler from './handlers/imageHandler';
import canvasHandler from './handlers/canvasHandler';
import Line from './handlers/line';

const tools = {
    'Line': Line,
};

const INITIAL_STATE = {
    Polygon: [],
    Line: [],
}

class DrawCanvas extends React.PureComponent {

    state = {
        pastData: INITIAL_STATE,
        data: INITIAL_STATE,
    }

    componentDidMount() {
        this.ctx = this.canvas.getContext('2d');
        this.tool = tools[this.props.tool];
        this.tool.ctx = this.ctx;
    }

    onMouseDown = (e) => {
        const { brushSize, color, tool } = this.props;
        this.tool.onMouseDown(this.getCursorPosition(e), { brushSize, color, tool });
    }

    onMouseMove = (e) => {
        this.tool.onMouseMove(this.getCursorPosition(e))
    }

    onMouseUp = (e) => {
        const { tool } = this.props;
        const newData = this.tool.onMouseUp(this.getCursorPosition(e));
        this.setState({
            pastData: { ...this.state.data },
            data: {
                ...this.state.data,
                [tool]: [ ...this.state.data[tool], newData]
            },
        }, () => {
            this.props.onCompleteDraw && this.props.onCompleteDraw(this.state.data);
        });
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
        this.setState({ data: INITIAL_STATE });
    }

    undo = () => {
        this.setState({ data: { ...this.state.pastData }});
    }

    render() {
        const { width, height, imgSrc, brushSize } = this.props;

        return(
            <React.Fragment>
                <canvas ref={canvas => this.canvas = canvas} width={width} height={height}
                    style={{ border: '2px solid', color: 'black',
                        backgroundImage: `url(${imgSrc})`,
                        backgroundSize: 'cover'
                    }}
                    onMouseDown={this.onMouseDown}
                    onMouseMove={this.onMouseMove}
                    onMouseUp={this.onMouseUp}
                />
                <div>
                    <button> Line </button>
                    <button onClick={this.cleanCanvas}>
                        Clean Canvas
                    </button>
                    <button onClick={this.undo}>
                        Undo
                    </button>
                </div>
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
     * Color
     */
    color: type.string,
}


DrawCanvas.defaultProps = {
    width: 300,
    height: 300,
    imgCover: false,
    brushSize: 2,
    color: 'black',
    tool: 'Line'
}

export default DrawCanvas;
