import compare = require('./compare');
import routes = require('../routes');
import Match = Types.Match;
export = bestMatch;

function bestMatch(request: Types.Request): Types.Route {    
    var comparisons = routes
        .filter(r => r.options.method === request.method)
        .map(route => compare(request, route))
        .map(toComparison)
        .filter(comparison => comparison.matches != null);

    var matches = comparisons.slice();

    for (var i = 0; i < request.parts.length; i++) {
        var forMatches = (comparator: Match) => (comparison: Comparison) => {
            var exactMatch = comparison.matches[i] === comparator;
            
            var lastMatch = comparison.matches[comparison.matches.length];
            var wildcardMatch = lastMatch === Match.Wildcard;
            
            return exactMatch || wildcardMatch;
        }
        var exactMatches = [];

        for (var key in matchPriority) {
            var comparator = matchPriority[key];
            exactMatches = matches.filter(forMatches(comparator));
            if (exactMatches.length !== 0) break;
        }
        
        // We must find matches during each iteration
        if (exactMatches.length === 0) return null;
        matches = exactMatches.slice();
    }

    if (matches.length > 1) {        
        // Ambiguous match -- can occur when using wildcards
        
        // TODO: How to handle?
        // Get the match that doesn't have a wildcard (will only be one)
        // If there is none, get the longest wildcard match (based on parts.length)
        
        // If there are several matches, throw an error -- `add(routeOptions)` should prevent this scenario
    }

    return routes[matches[0].index];
}

function toComparison(matches: Array<Match>, index: number) {
    return {
        index,
        matches
    };
}

var matchPriority = [
    Match.Part,
    Match.Type,
    Match.Any
];

interface Comparison {
    index: number;
    matches: Array<Match>;
}