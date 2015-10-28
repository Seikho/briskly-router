import compare = require('./compare');
import routes = require('../routes');
import Match = Types.Match;

function bestMatch(request: Types.Request): Types.Route {
    var comparisons = routes
        .map(route => compare(request, route))
        .filter(result => result != null);

    var matches = comparisons.slice();
    for (var i = 0; i < request.parts.length; ++i) {
        var exactMatches = [];
        for (var comparator in matchPriority) {
            exactMatches = matches
                .filter(result => result[i] === comparator);
            
            if (exactMatches.length === 0) continue;
            
            // Return the outer loop
            break;
        }
        
        if (exactMatches.length === 0) 

        if (matches.length > 0) continue;

    }

    if (matches.length > 1) {
        // Ambiguous match
    }
    
    return null;
}

var matchPriority = [
    Match.Part,
    Match.Type,
    Match.Any
];

