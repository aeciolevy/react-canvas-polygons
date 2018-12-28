// Dependecies 
import canvasHandler from './canvasHandler';
import utils, { to } from './utils';

const imageHandler = {};

imageHandler.loadBackground = (canvasCtx, url, sizeCover = false) => {
    const img = new Image();
    img.onload = function () {
        canvasCtx.drawImage(img, 0, 0);
    };
    img.src = url;
}

export default imageHandler;
