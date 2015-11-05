var routes = require('../routes');
var match = require('./route-part');
function compare(route) {
    var matches = routes
        .filter(function (r) { return r.parts.length === route.length; })
        .filter(function (left) { return left.parts.every(function (p, i) { return match(p, route[i]) !== 3 /* None */; }); });
    // This should only return one or no result
    return matches;
}
module.exports = compare;
//# sourceMappingURL=route.js.map