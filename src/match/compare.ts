import Match = Types.Match;
import matchPart = require('./part');
export = compare;

function compare(request: Types.Request, route: Types.Route): Array<Match> {
    var sameLength = request.parts.length === route.parts.length;
    var hasWildcard = route.parts.some(r => r.type === 'wildcard');
    
    if (!sameLength && !hasWildcard) return null;
    
    var matches = request.parts.map((part, i) => matchPart(part, route.parts[i]));
    
    var hasNone = matches.some(match => match === Match.None);
    if (hasNone) return null;
    
    return matches;
}