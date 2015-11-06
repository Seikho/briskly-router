import Types = require('../index.d.ts');
import match = require('./route-part');
export = compare;

function compare(route: Types.RoutePart[], routes: Types.Route[]) {    
    var matches = routes
        .filter(r => r.parts.length === route.length)
        .filter(left => left.parts.every((p, i) => match(p, route[i]) !== BR.Match.None));
    
    // This should only return one or no result
    return matches;
}