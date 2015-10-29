var compare = require('./compare');
var routes = require('../routes');
function bestMatch(request) {
    var comparisons = routes
        .map(function (route) { return compare(request, route); })
        .map(toComparison)
        .filter(function (comparison) { return comparison.matches != null; });
    var matches = comparisons.slice();
    for (var i = 0; i < request.parts.length; ++i) {
        var forMatches = function (comparator) { return function (comparison) { return comparison.matches[i] === comparator; }; };
        var exactMatches = [];
        for (var comparator in matchPriority) {
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