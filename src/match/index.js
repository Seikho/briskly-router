var toRequest = require('./request');
function match(path, method) {
    method = method.toUpperCase();
    var request = toRequest(path, method);
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
module.exports = match;
//# sourceMappingURL=index.js.map