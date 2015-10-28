var compare = require('./compare');
var routes = require('../routes');
function bestMatch(request) {
    var comparisons = routes
        .map(function (route) { return compare(request, route); })
        .filter(function (result) { return result != null; });
    var matches = comparisons.slice();
    for (var i = 0; i < request.parts.length; ++i) {
        var exactMatches = [];
        for (var comparator in matchPriority) {
            exactMatches = matches
                .filter(function (result) { return result[i] === comparator; });
            if (exactMatches.length === 0)
                continue;
            // Return the outer loop
            break;
        }
        if (exactMatches.length === 0)
            if (matches.length > 0)
                continue;
    }
    if (matches.length > 1) {
    }
    return null;
}
var matchPriority = [
    0 /* Part */,
    1 /* Type */,
    2 /* Any */
];
//# sourceMappingURL=best.js.map