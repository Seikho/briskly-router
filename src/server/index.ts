import http = require('http');
import routes = require('../routes');
import match = require('../match');
import forms = require('formidable');
import errors = require('../errors');
import qs = require('querystring');
import fs = require('fs');
import pth = require('path');
import logger = require('ls-logger');
import toRequest = require('../match/request')

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
    var params = getParameters(path);
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
        handler({ query, path, wildcard, body: {}, params }, reply);
    }
});

function getParameters(path: string) {
    var request = toRequest(path);
    var parameters: any = {};
    var parts = request.parts.forEach(part => {
       if (part.cast == null) return;
       parameters[part.part] = part.value;
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
        handler({ body: fields, path: parsed.path, wildcard, query: {}, params }, toReply(response));
    }

    formParser.parse(message, callback);
}

function toReply(response: http.ServerResponse) {
    var reply: any = (data: any, statusCode?: number) => {
        if (reply.called)
            return logger.error(errors.ReplyOnlyOnce);

        reply.called = true;
        response.statusCode = statusCode || 200;
        response.write(data);
        response.end();
    }

    reply.called = false;

    reply.file = (filePath: string) => {
        // TODO: Implement me!!
        fs.readFile(filePath, 'utf8', (err, data) => {
            if (err) return reply(`Unable to load file: ${filePath}`, 404);
            reply(data);
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