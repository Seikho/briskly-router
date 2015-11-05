import routes = require('../routes');
import match = require('./route-part');

function compare(route: Types.RoutePart[]) {    
    var matches = routes
        .filter(r => r.parts.length === route.length)
        .filter(left => left.parts.every((p, i) => match(p, route[i]) !== Types.Match.None));
    
    // This should only return one or no result
    return matches;
}