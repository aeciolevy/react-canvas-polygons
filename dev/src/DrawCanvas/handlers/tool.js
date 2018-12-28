const Tool = {

    onMouseDown() {
        throw new Error('onMouseDown must be implemented.');
    },
    
    onMouseMove() {
        throw new Error('onMouseMove must be implemented.');
    },

    onMouseUp() {
        throw new Error('onMouseUp must be implemented.');
    },

    resetState() {
        this.state = null;
    } 
}

export default Tool;
