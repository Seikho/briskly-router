import Types = require('../index.d.ts');
import errors = require('./errors');
import routes = require('./routes');
import routeParser = require('./parsers/route');
export = route;

function route(options: Types.RouteOptions) {
    if (!options) throw new Error(errors.NoOptions);
    if (!options.handler) throw new Error(errors.NoHandler);
    if (!options.method) throw new Error(errors.NoMethod);
    if (!options.path) throw new Error(errors.NoPath);

    if (options.path.slice(0, 1) !== '/') options.path = '/' + options.path;

    var parts = routeParser(options.path);
    
    routes.push({
        parts,
        options
    });
}