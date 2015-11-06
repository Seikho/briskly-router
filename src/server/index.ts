import http = require('http');
import handler = require('./handler');
export = create;

function create() {
    var server = http.createServer();
    server.on('request', handler);
    
    return server;
}

