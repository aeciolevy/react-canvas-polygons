import React from 'react';
import type from 'prop-types';
import Line from './handlers/line';
import Polygon from './handlers/polygon';

const tools = {
    'Line': Line,
    'Polygon': Polygon,
};

const INITIAL_STATE = {
    Polygon: [],
    Line: [],
}

class DrawCanvas extends React.PureComponent {

    state = {
        pastData: INITIAL_STATE,
        data: INITIAL_STATE,
        canvasData: [],
        tool: 'Line'
    }

    componentDidMount() {
        this.ctx = this.canvas.getContext('2d');
        this.tool = tools[this.props.tool];
        this.tool.ctx = this.ctx;
        this.tool.init();
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
        const { tool } = this.state;
        if (data) {
            this.setState({
                pastData: { ...this.state.data },
                data: {
                    ...this.state.data,
                    [tool]: [...this.state.data[tool], data.data]
                },
                canvasData: [...this.state.canvasData, data.canvas],
            }, () => {
                this.props.onCompleteDraw && this.props.onCompleteDraw(this.state.data);
            });
        }
    }

    onMouseLeave = () => {
        // if (this.tool.state) {
        //     this.tool.state.started = null;
        // }
        // this.undo();
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
        let tempCanvasData = [...this.state.canvasData];
        tempCanvasData.pop();
        this.setState({
            data: { ...this.state.pastData },
            canvasData: [...tempCanvasData]
        }, () => {
            console.log('context undo: ', this.state.canvasData);
            this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
            this.state.canvasData.forEach(el => {
                const { tool } = el.options;
                this.tool = tools[tool];
                this.tool.draw(el.start, el.end, false, { options: el.options});
            });
        });
    }

    // TODO: This button should be dependency injection
    handleButtonClick = (event) => {
        event.stopPropagation();
        const { name } = event.target;
        this.setState({ tool: name }, () => {
            this.tool = tools[this.state.tool]
            this.tool.ctx = this.ctx;
            this.tool.resetState();
            console.log(this.tool);
        });
    }

    onKeyUp = (event) => {
        this.tool.onKeyUp(event, this.tool, (event) => {
            if (event === 'Escape') {
                this.undo();
            }
        });
    }

    render() {
        const { width, height, imgSrc } = this.props;

        return(
            <React.Fragment>
                <canvas tabIndex="1"
                    ref={canvas => this.canvas = canvas} width={width} height={height}
                    style={{ border: '2px solid', color: 'black',
                        backgroundImage: `url(${imgSrc})`,
                        backgroundSize: 'cover'
                    }}
                    onMouseDown={this.onMouseDown}
                    onMouseMove={this.onMouseMove}
                    onMouseUp={this.onMouseUp}
                    onMouseLeave={this.onMouseLeave}
                />
                <div onClick={this.handleButtonClick}>
                    <button name="Line"
                        style={{ backgroundColor: this.state.tool === 'Line' && '#8080805c' || 'unset'}}>
                        Line
                    </button>
                    <button name="Polygon"
                        style={{ backgroundColor: this.state.tool === 'Polygon' && '#8080805c' || 'unset' }}
                    >
                        Polygon
                    </button>
                    <button name="Rect"
                        style={{ backgroundColor: this.state.tool === 'Rect' && '#8080805c' || 'unset' }}
                    >
                        Everything
                    </button>
                </div>
                <div>
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
    color: '#000000',
    tool: 'Line'
}

export default DrawCanvas;
