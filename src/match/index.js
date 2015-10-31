var toRequest = require('./request');
var best = require('./best');
function match(path, method) {
    method = method.toUpperCase();
    var request = toRequest(path, method);
    return best(request);
}
module.exports = match;
//# sourceMappingURL=index.js.map