import config = require('../config');
import server = require('./index');
import connection = require('../connection');

const DEFAULT_PORT = 2189;
const DEFAULT_HOST = null;

export = function start(callback: () => void) {
    var port = connection.port || config.port || DEFAULT_PORT;
    var host = connection.host || config.host || DEFAULT_HOST;
    
    server.listen(port, host, callback);
}