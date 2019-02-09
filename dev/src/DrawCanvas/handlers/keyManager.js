const keyManager = {};

const INITIAL_EVENTS = {
    Escape: [],
}

keyManager.init = () => keyManager.events = INITIAL_EVENTS;

keyManager.events = {
    Escape: [],
}

keyManager.add = (keyCode, handle) => {
    keyManager.events[keyCode].push(handle);
};

keyManager.dispatch = (keyCode, tool, callback) => {
    if (!keyManager.events[keyCode]) return;
    keyManager.events[keyCode].forEach(handler => {
        handler(tool);
        callback && callback(keyCode);
    });
};

export default keyManager;
