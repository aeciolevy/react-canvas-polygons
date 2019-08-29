/* Inspired by: https://codepen.io/abidibo/pen/rmGBc */
/**
 * This module handles the undo and redo of canvas
 * drawing
 */


const history = {};

function removeLine (data) {
    data.Line.pop();
    let newData = { ...data }
    return newData;
}

function removeProperty (property, data) {
    const { [property]: propertyDeleted, ...newData } = data;
    return newData;
}

history.cancel = (currentProperty, data) => {
    let newData;
    if (currentProperty === 'Line') {
        newData = removeLine(data);
    } else if (currentProperty) {
        newData = removeProperty(currentProperty, data);
    }
    return newData;
}

history.filterPolygon = (data) => {
    return Object.keys(data).reduce((acc, curr) => {
        if (curr.startsWith('Poly')) {
            if (curr.length < 3) {
                return acc;
            }
        }
        acc[curr] = data[curr];
        return acc;
    }, {});
}

// history.redo_list = [];
// history.undo_list = [];
// history.saveState = function (canvas, list, keep_redo) {
//     console.log('history save state');
//     keep_redo = keep_redo || false;
//     if (!keep_redo) {
//         this.redo_list = [];
//     }

//     (list || this.undo_list).push(canvas.toDataURL());
//     console.log(this.undo_list);
// };

// history.undo = function (canvas, ctx) {
//     console.log('history UNDO');
//     this.restoreState(canvas, ctx, this.undo_list, this.redo_list);
// };

// history.redo = function (canvas, ctx) {
//     this.restoreState(canvas, ctx, this.redo_list, this.undo_list);
// };

// history.restoreState = function (canvas, ctx, pop, push) {
//     if (pop.length) {
//         this.saveState(canvas, push, true);
//         var restore_state = pop.pop();
//         var img = document.createElement('img');
//         img.src = restore_state;
//         img.onload = function () {
//             ctx.clearRect(0, 0, canvas.width, canvas.height);
//             ctx.drawImage(img, 0, 0, canvas.width, canvas.height, 0, 0, canvas.width, canvas.height);
//         }
//     }
// };

export default history;
