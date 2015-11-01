var matchPart = require('./part');
function compare(request, route) {
    var sameLength = request.parts.length === route.parts.length;
    var hasWildcard = route.parts.some(function (r) { return r.type === 'wildcard'; });
    if (!sameLength && !hasWildcard)
        return null;
    var matches = request.parts
        .map(function (part, i) { return matchPart(part, route.parts[i]); });
    if (hasWildcard)
        matches.map(function (m) { return m == null ? 4 /* Wildcard */ : m; });
    var hasNone = matches.some(function (match) { return match === 3 /* None */; });
    if (hasNone)
        return null;
    return matches;
}
module.exports = compare;
//# sourceMappingURL=compare.js.map