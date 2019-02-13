const canvasHandler = {};


canvasHandler.setDimension = (canvas, { height, width }) => {
    if (width) {
        canvas.width = width;
    }
    if (height) {
        canvas.height = height;
    }
}

// from http://blog.shkedy.com/2007/01/createing-guids-with-client-side.html
canvasHandler.uuid = () => {
    let result, i, j;
    result = '';
    for (j = 0; j < 32; j++) {
        if (j == 8 || j == 12 || j == 16 || j == 20)
            result = result + '-';
        i = Math.floor(Math.random() * 16).toString(16).toUpperCase();
        result = result + i;
    }
    return result
}

export default canvasHandler;
