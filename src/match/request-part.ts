import Types = require('../index.d.ts');
import Match = BR.Match;
export = isMatch;

function isMatch(request: Types.RequestPart, route: Types.RoutePart) {
    if (route == null) return null;

    if (route.type === 'route')
        return request.part === route.part
            ? Match.Literal
            : Match.None;

    if (route.type === 'multi') {
        var pfx = (route.prefix || '');
        var sfx = (route.suffix || '');
        var prefixMatch = route.prefix == null || request.part.slice(0, pfx.length) === pfx;
        var suffixMatch = route.suffix == null || request.part.slice(-sfx.length) === sfx;

        return prefixMatch && suffixMatch
            ? Match.Mixed
            : Match.None;
    }

    if (route.type === 'wildcard')
        return Match.Wildcard;

    if (route.cast === 'any')
        return Match.Any;

    return route.cast === request.cast
        ? Match.Type
        : Match.None;
}

