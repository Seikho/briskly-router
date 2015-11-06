import Types = require('../index.d.ts');
import http = require('http');
import handler = require('./handler');
export = create;

function create(routes: Types.Route[]) {
    var server = http.createServer();
    server.on('request', (message, response) => handler(message, response, routes));
    
    return server;
}

