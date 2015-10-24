import Types = require('../../index.d.ts');
import Match = Types.Match;
import matchPart = require('./part');

function isMatch(request: Types.Request, route: Types.Route): Array<Match> {
    if (request.parts.length !== route.parts.length) return null;
    
    var matches = request.parts.map((part, i) => matchPart(part, route.parts[i]));
    
    var hasNone = matches.some(match => match === Match.None);
    if (hasNone) return null;
    
    return matches;
}