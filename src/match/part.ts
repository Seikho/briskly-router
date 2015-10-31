import Match = Types.Match;
export = isMatch;

function isMatch(request: Types.RequestPart, route: Types.RoutePart) {
    if (route == null) return null;
    
    if (route.type === 'route')
        return request.part === route.part
            ? Match.Part
            : Match.None;

    if (route.type === 'wildcard')
        return Match.Wildcard;

    if (route.cast === 'any')
        return Match.Any;

    return route.cast === request.cast
        ? Match.Type
        : Match.None;
}

