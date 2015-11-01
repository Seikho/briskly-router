var errors = require('./errors');
var routes = require('./routes');
var routeParser = require('./parsers/route');
function route(options) {
    if (!options)
        throw new Error(errors.NoOptions);
    if (!options.handler)
        throw new Error(errors.NoHandler);
    if (!options.method)
        throw new Error(errors.NoMethod);
    if (!options.path)
        throw new Error(errors.NoPath);
    if (options.path.slice(0, 1) !== '/')
        options.path = '/' + options.path;
    options.method = options.method.toUpperCase();
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
    var matchingParams = parts
        .some(function (part) { return parts.filter(function (p) { return p.cast != null && p.part === part.part; }).length > 1; });
    if (matchingParams)
        throw new Error(errors.MatchingParamNames);
    var length = parts.length;
    if (length === 0)
        throw new Error(errors.InvalidPath);
    var wildcardCount = parts.filter(function (p) { return p.type === 'wildcard'; }).length;
    if (wildcardCount > 1)
        throw new Error(errors.InvalidWildCard);
    var wildcardBeforeEnd = parts.some(function (part, index) { return part.type === 'wildcard' && index !== length - 1; });
    if (wildcardBeforeEnd)
        throw new Error(errors.InvalidWildCard);
    routes.push({
        parts: parts,
        options: options
    });
}
module.exports = route;
//# sourceMappingURL=route.js.map