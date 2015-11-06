var http = require('http');
var handler = require('./handler');
function create(routes) {
    var server = http.createServer();
    server.on('request', function (message, response) { return handler(message, response, routes); });
    return server;
}
module.exports = create;
//# sourceMappingURL=index.js.map