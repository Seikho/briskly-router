var requestParser = require('../parsers/request');
function match(path) {
    var request = toRequest(path);
    // TODO: find matching routes
    var options = {
        method: 'GET',
        path: path,
        handler: function (req, reply) {
            console.log(req);
            reply('success');
        }
    };
    return options;
}
function toRequest(path) {
    var parts = requestParser(path);
    return {
        parts: parts,
        path: path
    };
}
module.exports = match;
//# sourceMappingURL=index.js.map