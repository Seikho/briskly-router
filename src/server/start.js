var config = require('../config');
var server = require('./index');
var DEFAULT_PORT = 2189;
module.exports = function start(callback) {
    var port = config.port || DEFAULT_PORT;
    server.listen(port, callback);
};
//# sourceMappingURL=start.js.map