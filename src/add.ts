import routes = require('./routes');
import routeParser = require('./parsers/route');
export = add;

function add(options: Types.RouteOptions) {
    var parts = routeParser(options.path);
    options.method = options.method.toUpperCase();
    
    // TODO: Chcek for ambiguous routes
    routes.push({
        options,
        parts
    });
}
