var toRequest = require('./to-request');
var best = require('./best');
function match(path, method, routes) {
    method = method.toUpperCase();
    var request = toRequest(path, method);
    return best(request, routes);
}
module.exports = match;
//# sourceMappingURL=index.js.map