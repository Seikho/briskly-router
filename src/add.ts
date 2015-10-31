import routes = require('./routes');
import routeParser = require('./parsers/route');
import errors = require('./errors')
export = add;

function add(options: Types.RouteOptions) {
    var parts = routeParser(options.path);
    options.method = options.method.toUpperCase();

    var matchingParams = parts
        .some(part => parts.filter(p => p.type != null && p.part === part.part).length > 1);
    
    if (matchingParams)
        throw new Error(errors.MatchingParamNames);
    
    // TODO: Chcek for ambiguous routes
    routes.push({
        options,
        parts
    });
}
