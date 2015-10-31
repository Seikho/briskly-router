import http = require('http');
import routes = require('../routes');
import match = require('../match');
import forms = require('formidable');
import qs = require('querystring');

export = server;

var server = http.createServer();

server.on('request', (message: http.IncomingMessage, response: http.ServerResponse) => {
    var error = false;
    var method = message.method;
    var parsedUrl = parseUrl(message.url);
    var path = parsedUrl.path;
    var query = parsedUrl.query;

    var route = match(path, method);
    var wildcard = getWildcardPath(path, route);
    if (!route) {
        response.statusCode = 404;
        response.end('Not found');
        return;
    }

    if (method === 'POST') {
        return postHandler(message, response, route.options, wildcard);
    }

    route.options.handler({ query, path, wildcard, body: {} }, toReply(response));
});

function postHandler(message: http.IncomingMessage, response: http.ServerResponse, routeHandler: Types.RouteOptions, wildcard: string) {
    var body = '';
    var error = false;
    var parsed = parseUrl(message.url);
    var formParser = new forms.IncomingForm();
    var callback = (err, fields) => {
        routeHandler.handler({ body: fields, path: parsed.path, wildcard, query: {} }, toReply(response));
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

function getWildcardPath(path: string, route: Types.Route) {
    var split = path.split('/');
    var wildcardIndex = route.parts.reduce((prev, curr, i) => curr.type === 'wildcard' ? i : prev, -1);
    
    if (wildcardIndex === -1) return null;
    
    return '/' + split.slice(wildcardIndex).join('/');
}