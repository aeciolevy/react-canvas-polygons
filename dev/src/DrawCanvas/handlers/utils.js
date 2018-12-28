const utils = {};

utils.isURL = (url) => {
    const regex = new RegExp('(http)s?', 'i');
    return url.match(regex) && url.match(regex).length > 0 ? true : false;
}

/**
* @author Aécio Levy
* @function to
* @usage: Use async/await with catch
* @param { Promise }
* @summary: Based on https://github.com/scopsy/await-to-js
*/
export const to = promise => promise
    .then(data => [null, data])
    .catch(err => [err, null]);

export default utils;
