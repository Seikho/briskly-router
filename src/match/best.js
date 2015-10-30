var compare = require('./compare');
var routes = require('../routes');
function bestMatch(request) {
    var comparisons = routes
        .filter(function (r) { return r.options.method === request.method; })
        .map(function (route) { return compare(request, route); })
        .map(toComparison)
        .filter(function (comparison) { return comparison.matches != null; });
    var matches = comparisons.slice();
    for (var i = 0; i < request.parts.length; i++) {
        var forMatches = function (comparator) { return function (comparison) {
            var exactMatch = comparison.matches[i] === comparator;
            var lastMatch = comparison.matches[comparison.matches.length];
            var wildcardMatch = lastMatch === 4 /* Wildcard */;
            return exactMatch || wildcardMatch;
        }; };
        var exactMatches = [];
        for (var key in matchPriority) {
            var comparator = matchPriority[key];
            exactMatches = matches.filter(forMatches(comparator));
            if (exactMatches.length !== 0)
                break;
        }
        // We must find matches during each iteration
        if (exactMatches.length === 0)
            return null;
        matches = exactMatches.slice();
    }
    if (matches.length > 1) {
        // Ambiguous match -- can occur when using wildcards
        // TODO: How to handle?
        // Get the match that doesn't have a wildcard (will only be one)
        // If there is none, get the longest wildcard match (based on parts.length)
        // If there are several matches, throw an error -- `add(routeOptions)` should prevent this scenario
        var exactMatch = matches.filter(function (match) { return match.matches.every(function (m) { return m !== 4 /* Wildcard */; }); })[0];
        if (exactMatch)
            return routes[exactMatch.index];
        var maxLength = matches.reduce(function (prev, curr) { return prev = curr.matches.length > prev ? curr.matches.length : prev; }, 0);
        var longest = matches.filter(function (match) { return match.matches.length === maxLength; });
        if (longest.length > 1)
            throw new Error("Ambiguous route detected (" + request.path + ")");
        return routes[longest[0].index];
    }
    return routes[matches[0].index];
}
function toComparison(matches, index) {
    return {
        index: index,
        matches: matches
    };
}
var matchPriority = [
    0 /* Part */,
    1 /* Type */,
    2 /* Any */
];
module.exports = bestMatch;
//# sourceMappingURL=best.js.map