var routes = require('./routes');
var routeParser = require('./parsers/route');
var errors = require('./errors');
function add(options) {
    if (options.path === '/') {
        var alreadyExists = routes.some(function (r) { return r.options.path === '/'; });
        if (alreadyExists)
            return;
        routes.push({
            options: options,
            parts: []
        });
        return;
    }
    var parts = routeParser(options.path);
    options.method = options.method.toUpperCase();
    var matchingParams = parts
        .some(function (part) { return parts.filter(function (p) { return p.cast != null && p.part === part.part; }).length > 1; });
    if (matchingParams)
        throw new Error(errors.MatchingParamNames);
    // TODO: Chcek for ambiguous routes
    routes.push({
        options: options,
        parts: parts
    });
}
module.exports = add;
//# sourceMappingURL=add.js.map