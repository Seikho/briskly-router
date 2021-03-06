import compare = require('./compare');
import Types = require('../index.d.ts');
import Match = BR.Match;
export = bestMatch;

function bestMatch(request: Types.Request, routes: Types.Route[]): Types.Route {
    var exactPathMatch = getExactPathMatch(request.path, routes);
    if (exactPathMatch) return exactPathMatch;

    var possibleRoutes = routes
        .filter(r => r.options.method === request.method);
        
    var comparisons = possibleRoutes
        .map(route => compare(request, route))
        .map(toComparison)
        .filter(comparison => comparison.matches != null);
        
    var matches = comparisons.slice();

    for (var i = 0; i < request.parts.length; i++) {
        var forMatches = (comparator: Match) => (comparison: Comparison) => {
            var exactMatch = comparison.matches[i] === comparator;

            return exactMatch;
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
        
        // Get the match that doesn't have a wildcard (will only be one)
        // If there is none, get the longest wildcard match (based on parts.length)
        
        // If there are several matches, throw an error -- `add(routeOptions)` should prevent this scenario
        
        var exactMatch = matches.filter(match => match.matches.every(m => m !== Match.Wildcard))[0];
        if (exactMatch) return routes[exactMatch.index];

        var maxLength = matches.reduce((prev, curr) => prev = curr.matches.length > prev ? curr.matches.length : prev, 0);
        var longest = matches.filter(match => match.matches.length === maxLength);
        if (longest.length > 1) throw new Error(`Ambiguous route detected (${request.path})`);

        return possibleRoutes[longest[0].index];
    }

    return possibleRoutes[matches[0].index];
}

function toComparison(matches: Array<Match>, index: number) {
    return {
        index,
        matches
    };
}

function getExactPathMatch(path: string, routes: Types.Route[]) {
    var exact = routes.filter(r => r.options.path === path)[0];
    return exact;
}

var matchPriority = [
    Match.Literal,
    Match.Mixed,
    Match.Type,
    Match.Any,
    Match.Wildcard
];

interface Comparison {
    index: number;
    matches: Array<Match>;
}