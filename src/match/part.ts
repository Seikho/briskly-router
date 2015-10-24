import Types = require('../../index.d.ts');
import Match = Types.Match;
export = isMatch;

function isMatch(request: Types.RequestPart, route: Types.RoutePart) {
    if (route.type === 'route')
        return request.part === route.part
            ? Match.Part
            : Match.None;

    if (route.cast === 'any')
        return Match.Parameter;

    return route.cast === request.cast
        ? Match.Parameter
        : Match.None;
}

