import compare = require('./compare');
import routes = require('../routes');
import Match = Types.Match;

function bestMatch(request: Types.Request): Types.Route {
    var comparisons = routes
        .map(route => compare(request, route))
        .map(toComparison)
        .filter(comparison => comparison.matches != null);

    var matches = comparisons.slice();


    for (var i = 0; i < request.parts.length; ++i) {
        var forMatches = (comparator: Match) => (comparison: Comparison) => comparison.matches[i] === comparator;
        var exactMatches = [];

        for (var comparator in matchPriority) {
            exactMatches = matches.filter(forMatches(comparator));
            if (exactMatches.length !== 0) break;
        }
        
        // We must find matches during each iteration
        if (exactMatches.length === 0) return null;
        matches = exactMatches.slice();
    }

    if (matches.length > 1) {
        // Ambiguous match -- should not occur
        // TODO: How to handle?
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