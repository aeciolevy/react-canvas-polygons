import React from 'react';
import type from 'prop-types';
import imageHandler from './handlers/imageHandler';
import canvasHandler from './handlers/canvasHandler';
import Line from './handlers/line';
import line from './handlers/line';

class DrawCanvas extends React.PureComponent {

    state = {
    }

    componentDidMount() {
        const { imgSrc } = this.props;
        this.canvas = this.refs.canvas;
        this.ctx = this.canvas.getContext('2d');
        // if (imgSrc) {
        //     // imageHandler.loadBackground(this.ctx, imgSrc);
        // }
    }

    onMouseDown = (e) => {
        Line.ctx = this.ctx;
        Line.onMouseDown(this.getCursorPosition(e));
    }

    onMouseMove = (e) => {
        Line.onMouseMove(this.getCursorPosition(e))
    }

    onMouseUp = (e) => {
        Line.onMouseUp(this.getCursorPosition(e));
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
    }

    render() {
        const { width, height, imgSrc } = this.props;

        return(
            <React.Fragment>
                <canvas ref="canvas" width={width} height={height} 
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
}


DrawCanvas.defaultProps = {
    width: 300,
    height: 300,
    imgCover: false,
}

export default DrawCanvas;
