import connection = require('./connection');
import route = require('./route');
import server = require('./server');
import start = require('./server/start');
import stop = require('./server/stop');
var pkg = require('../package.json');

export = api;

var api = {
    route,
    server,
    start,
    stop,
    connection: connection.connection,
    version: <string>null
};

Object.defineProperty(api, 'version', {
    get: () => pkg.version
});



