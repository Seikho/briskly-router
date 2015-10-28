var requestParser = require('../parsers/request');
function toRequest(path) {
    var parts = requestParser(path);
    return {
        parts: parts,
        path: path
    };
}
module.exports = toRequest;
//# sourceMappingURL=request.js.map