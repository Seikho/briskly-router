import Types = require('../index.d.ts');
import errors = require('./errors');
import routes = require('./routes');
export = route;

function route(options: Types.RouteOptions) {
    if (!options) throw new Error(errors.NoOptions);
    if (!options.handler) throw new Error(errors.NoHandler);
    if (!options.method) throw new Error(errors.NoMethod);
    if (!options.path) throw new Error(errors.NoPath);
    
    routes.push(options);
}