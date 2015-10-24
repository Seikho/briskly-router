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
    var parts = routeParser(options.path);
    routes.push({
        parts: parts,
        options: options
    });
}
module.exports = route;
//# sourceMappingURL=route.js.map