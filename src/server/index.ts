import http = require('http');
import routes = require('../routes');
import match = require('../match');
import forms = require('formidable');
import qs = require('querystring');

export = server;

var server = http.createServer();

server.on('request', (message: http.IncomingMessage, response: http.ServerResponse) => {
    var error = false;
    var method = message.method.toUpperCase();
    var parsedUrl = parseUrl(message.url);
    var path = parsedUrl.path;
    var query = parsedUrl.query;

    var routeHandler = match(path);

    if (method === 'POST') {
        return postHandler(message, response, routeHandler);
    }

    if (!routeHandler) {
        response.statusCode = 404;
        response.end('Not found');
        return;
    }

    routeHandler.handler({ query, path }, toReply(response));
});

var postHandler = (message: http.IncomingMessage, response: http.ServerResponse, routeHandler: Types.RouteOptions) => {
    var body = '';
    var error = false;
    var parsed = parseUrl(message.url);
    var formParser = new forms.IncomingForm();
        
    var callback = (err, fields) => {
        routeHandler.handler({ body: fields, path: parsed. path }, toReply(response));
    }
    
    formParser.parse(message, callback);
}

function toReply(response: http.ServerResponse) {
    var reply: any = (data: any, statusCode?: number) => {
        response.statusCode = statusCode || 200;
        response.write(data);
        response.end();
    }

    reply.file = (filePath: string) => {
        // TODO: Implement me!!
        reply(filePath);
    }

    return reply;
}

function parseUrl(url: string) {
    var end = url.indexOf('?');

    if (end < 0) return {
        path: url,
        query: {}
    }

    var path = url.slice(0, end);
    var query = qs.parse(url.slice(end + 1));

    return { path, query };
}