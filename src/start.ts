import config = require('./config');
import server = require('./server');

const DEFAULT_PORT = 2189;

export = function start(callback: () => void) {
    var port = config.port || DEFAULT_PORT;
    
    server.listen(port, callback);
}