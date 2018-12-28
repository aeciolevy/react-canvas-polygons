import React from 'react';
import type from 'prop-types';
import imageHandler from './handlers/imageHandler';
import canvasHandler from './handlers/canvasHandler';

class DrawCanvas extends React.PureComponent {

    state = {
    }

    componentDidMount() {
        const { imgSrc } = this.props;
        this.canvas = this.refs.canvas;
        this.ctx = this.canvas.getContext('2d');
        if (imgSrc) {
            imageHandler.loadBackground(this.ctx, imgSrc);
        }
    }

    render() {
        const { width, height } = this.props;

        return(
            <React.Fragment>
                <canvas ref="canvas" width={width} height={height} style={{ border: '2px solid', color: 'black'}}/>
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
