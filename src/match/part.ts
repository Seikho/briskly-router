import Match = Types.Match;
export = isMatch;

function isMatch(request: Types.RequestPart, route: Types.RoutePart) {
    var safeRoute = route || { type: 'wildcard', part: '*' };
    if (safeRoute.type === 'route')
        return request.part === safeRoute.part
            ? Match.Part
            : Match.None;

    if (safeRoute == null || safeRoute.type === 'wildcard')
        return Match.Wildcard;

    if (safeRoute.cast === 'any')
        return Match.Any;

    return safeRoute.cast === request.cast
        ? Match.Type
        : Match.None;
}

