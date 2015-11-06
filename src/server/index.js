var http = require('http');
var handler = require('./handler');
function create() {
    var server = http.createServer();
    server.on('request', handler);
}
module.exports = create;
//# sourceMappingURL=index.js.map