import server = require('./index');

export = function stop(callback?: () => void) {
    server.close(callback);
}