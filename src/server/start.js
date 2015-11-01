var config = require('../config');
var server = require('./index');
var connection = require('../connection');
var DEFAULT_PORT = 2189;
var DEFAULT_HOST = null;
module.exports = function start(callback) {
    var port = connection.port || config.port || DEFAULT_PORT;
    var host = connection.host || config.host || DEFAULT_HOST;
    server.listen(port, host, callback);
};
//# sourceMappingURL=start.js.map