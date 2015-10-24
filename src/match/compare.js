var matchPart = require('./part');
function compare(request, route) {
    if (request.parts.length !== route.parts.length)
        return null;
    var matches = request.parts.map(function (part, i) { return matchPart(part, route.parts[i]); });
    var hasNone = matches.some(function (match) { return match === 3 /* None */; });
    if (hasNone)
        return null;
    return matches;
}
module.exports = compare;
//# sourceMappingURL=compare.js.map