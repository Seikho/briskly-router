import http = require('http');
import routes = require('../routes');
import match = require('../match');
import forms = require('formidable');
import errors = require('../errors');
import qs = require('querystring');
import fs = require('fs');
import pth = require('path');
import logger = require('ls-logger');
import toRequest = require('../match/to-request')

export = server;

var server = http.createServer();

server.on('request', (message: http.IncomingMessage, response: http.ServerResponse) => {
    var error = false;
    var method = message.method;
    var parsedUrl = parseUrl(message.url);
    var path = parsedUrl.path;
    var query = parsedUrl.query;

    var route = match(path, method);

    if (!route) {
        response.statusCode = 404;
        response.end('Not found');
        return;
    }

    var wildcard = getWildcardPath(path, route);
    var params = getParameters(path, route.parts);
    var handler = route.options.handler;
    var reply = toReply(response);
    if (isDir(handler)) {
        var filePath = pth.join(handler.directory, stripUpDirs(path));
        reply.file(filePath);
        return;
    }

    if (isFile(handler)) {
        var filePath = handler.file;
        reply.file(filePath);
        return;
    }

    if (method === 'POST') {
        return postHandler(message, response, route.options, wildcard, params);
    }

    if (isFunc(handler)) {
        handler({ query, path, wildcard, body: {}, params, message }, reply);
    }
});

function getParameters(path: string, routeParts: Types.RoutePart[]) {
    var request = toRequest(path);
    var parameters: any = {};
    var parts = routeParts.forEach((part, i) => {
        if (part.cast == null) return;
        var value = request.parts[i].value;

        if (part.type === 'multi') {
            var pfx = (part.prefix || '').length;
            var sfx = (part.suffix || '').length;

            if (pfx === 0) value = part.part.slice(0, -sfx);
            else if (sfx === 0) value = part.part.slice(pfx);
            else value = part.part.slice(pfx, -sfx);
        }

        parameters[part.part] = value;
    });
    return parameters;
}

function stripUpDirs(path: string) {
    var split = path.split('/..');
    return split.filter(s => s !== '').join('');
}

function postHandler(message: http.IncomingMessage, response: http.ServerResponse, routeHandler: Types.RouteOptions, wildcard: string, params: any) {
    var body = '';
    var error = false;
    var parsed = parseUrl(message.url);
    var formParser = new forms.IncomingForm();
    var callback = (err, fields) => {
        var handler = <Types.RouteHandler>routeHandler.handler;
        handler({ body: fields, path: parsed.path, wildcard, query: {}, params, message }, toReply(response));
    }

    formParser.parse(message, callback);
}

function toReply(response: http.ServerResponse) {
    var reply: any = (data: any, statusCode?: number) => {
        if (reply.called)
            return logger.error(errors.ReplyOnlyOnce);

        reply.called = true;
        statusCode = statusCode || 200;
        response.writeHead(statusCode, { 'Content-Type': 'application/json' });
        try {
            response.end(JSON.stringify(data));
        }
        catch (ex) {
            response.statusCode = 500;
            response.end(`Unhandled exception: ${ex.message}`);
        }
    }

    reply.called = false;

    reply.file = (filePath: string) => {
        reply.called = true;
        fs.readFile(filePath, 'utf8', (err, data) => {
            if (err) {
                console.log('404');
                response.statusCode = 404;
                response.write(`Unable to load file: ${filePath}`);
                response.end();
                return;
            }
            response.end(data);
        });
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

function isDir(a: Types.RouteHandler | Types.DirectoryHandler | Types.FileHandler): a is Types.DirectoryHandler {
    return a['directory'] != null;
}

function isFile(a: Types.RouteHandler | Types.DirectoryHandler | Types.FileHandler): a is Types.FileHandler {
    return a['file'] != null;
}

function isFunc(a: Types.RouteHandler | Types.DirectoryHandler | Types.FileHandler): a is Types.RouteHandler {
    return typeof a === 'function';
}