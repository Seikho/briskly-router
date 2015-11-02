var connection = require('./connection');
var route = require('./route');
var server = require('./server');
var start = require('./server/start');
var stop = require('./server/stop');
var pkg = require('../package.json');
var api = {
    route: route,
    server: server,
    start: start,
    stop: stop,
    connection: connection.connection,
    version: null
};
Object.defineProperty(api, 'version', {
    get: function () { return pkg.version; }
});
module.exports = api;
//# sourceMappingURL=index.js.map