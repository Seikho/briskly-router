var requestParser = require('../parsers/request');
function toRequest(path, method) {
    var parts = requestParser(path);
    method = (method || 'GET').toUpperCase();
    return {
        parts: parts,
        path: path,
        method: method
    };
}
module.exports = toRequest;
//# sourceMappingURL=to-request.js.map