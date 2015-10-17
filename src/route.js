var errors = require('./errors');
var routes = require('./routes');
function route(options) {
    if (!options)
        throw new Error(errors.NoOptions);
    if (!options.handler)
        throw new Error(errors.NoHandler);
    if (!options.method)
        throw new Error(errors.NoMethod);
    if (!options.path)
        throw new Error(errors.NoPath);
    routes.push(options);
}
module.exports = route;
//# sourceMappingURL=route.js.map