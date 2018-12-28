const canvasHandler = {};


canvasHandler.setDimension = (canvas, { height, width }) => {
    if (width) {
        canvas.width = width;
    }
    if (height) {
        canvas.height = height;
    }
}

export default canvasHandler;
