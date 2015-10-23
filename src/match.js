var requestParser = require('./parsers/request');
function match(path) {
    var parts = requestParser(path);
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
function isMatch(request, route) {
    if (route.type === 'route')
        return request.part === route.part;
    if (route.cast === 'any')
        return true;
    return route.cast === request.cast;
}
module.exports = match;
//# sourceMappingURL=match.js.map