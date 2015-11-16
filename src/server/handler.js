var forms = require('formidable');
var errors = require('../errors');
var logger = require('ls-logger');
var toRequest = require('../match/to-request');
var match = require('../match');
var pth = require('path');
var qs = require('querystring');
var fs = require('fs');
function handleRequest(message, response, routes) {
    var error = false;
    var method = message.method;
    var parsedUrl = parseUrl(message.url);
    var path = parsedUrl.path;
    var query = parsedUrl.query;
    var route = match(path, method, routes);
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
        handler({ query: query, path: path, wildcard: wildcard, body: {}, params: params, message: message }, reply);
    }
}
function getParameters(path, routeParts) {
    var request = toRequest(path);
    var parameters = {};
    var parts = routeParts.forEach(function (part, i) {
        if (part.cast == null)
            return;
        var value = request.parts[i].value;
        if (part.type === 'multi') {
            var pfx = (part.prefix || '').length;
            var sfx = (part.suffix || '').length;
            if (pfx === 0)
                value = part.part.slice(0, -sfx);
            else if (sfx === 0)
                value = part.part.slice(pfx);
            else
                value = part.part.slice(pfx, -sfx);
        }
        parameters[part.part] = value;
    });
    return parameters;
}
function stripUpDirs(path) {
    var split = path.split('/..');
    return split.filter(function (s) { return s !== ''; }).join('');
}
function postHandler(message, response, routeHandler, wildcard, params) {
    var body = '';
    var error = false;
    var parsed = parseUrl(message.url);
    var formParser = new forms.IncomingForm();
    var callback = function (err, fields) {
        var handler = routeHandler.handler;
        handler({ body: fields, path: parsed.path, wildcard: wildcard, query: {}, params: params, message: message }, toReply(response));
    };
    formParser.parse(message, callback);
}
function toReply(response) {
    var reply = function (data, statusCode) {
        if (reply.called)
            return logger.error(errors.ReplyOnlyOnce);
        reply.called = true;
        reply.headers['Content-Type'] = 'application/json';
        reply.writeHeaders();
        try {
            if (typeof data === 'string' || typeof data === 'number')
                return response.end(data.toString());
            response.end(JSON.stringify(data));
        }
        catch (ex) {
            response.statusCode = 500;
            response.end("Unhandled exception: " + ex.message);
        }
    };
    reply.headers = {};
    reply.statusCode = 200;
    reply.writeHeaders = function () {
        response.writeHead(reply.statusCode || 200, reply.headers);
    };
    reply.called = false;
    reply.file = function (filePath) {
        reply.called = true;
        fs.readFile(filePath, 'utf8', function (err, data) {
            if (err) {
                reply.statusCode = 404;
                reply.writeHeaders();
                response.end("Unable to load file: " + filePath);
                return;
            }
            reply.writeHeaders();
            response.end(data);
        });
    };
    reply.html = function (markup, statusCode) {
        reply.called = true;
        reply.headers['Content-Type'] = 'text/html';
        reply.writeHeaders();
        response.end(markup);
    };
    return reply;
}
function parseUrl(url) {
    var end = url.indexOf('?');
    if (end < 0)
        return {
            path: url,
            query: {}
        };
    var path = url.slice(0, end);
    var query = qs.parse(url.slice(end + 1));
    return { path: path, query: query };
}
function getWildcardPath(path, route) {
    var split = path.split('/');
    var wildcardIndex = route.parts.reduce(function (prev, curr, i) { return curr.type === 'wildcard' ? i : prev; }, -1);
    if (wildcardIndex === -1)
        return null;
    return '/' + split.slice(wildcardIndex).join('/');
}
function isDir(a) {
    return a['directory'] != null;
}
function isFile(a) {
    return a['file'] != null;
}
function isFunc(a) {
    return typeof a === 'function';
}
module.exports = handleRequest;
//# sourceMappingURL=handler.js.map