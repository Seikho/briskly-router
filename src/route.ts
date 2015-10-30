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

    var length = parts.length;
    if (length === 0) throw new Error(errors.InvalidPath);
    
    var wildcardCount = parts.filter(p => p.type === 'wildcard').length;
    if (wildcardCount > 1) throw new Error(errors.InvalidWildCard);
    
    var wildcardBeforeEnd = parts.some((part, index) => part.type === 'wildcard' && index !== length);
    if (wildcardBeforeEnd) throw new Error(errors.InvalidWildCard);

    routes.push({
        parts,
        options
    });
}