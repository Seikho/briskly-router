import server = require('./server');

export = function stop(callback?: () => void) {
    server.close(callback);
}