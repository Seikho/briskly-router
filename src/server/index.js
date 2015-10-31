var http = require('http');
var match = require('../match');
var forms = require('formidable');
var errors = require('../errors');
var qs = require('querystring');
var fs = require('fs');
var pth = require('path');
var logger = require('ls-logger');
var server = http.createServer();
server.on('request', function (message, response) {
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
    var handler = route.options.handler;
    var reply = toReply(response);
    if (isDir(handler)) {
        var filePath = pth.join(handler.directory, stripUpDirs(path));
        reply.file(filePath);
        return;
    }
    if (isFile(handler)) {
        reply.file(filePath);
        return;
    }
    if (method === 'POST') {
        return postHandler(message, response, route.options, wildcard);
    }
    if (isFunc(handler)) {
        handler({ query: query, path: path, wildcard: wildcard, body: {} }, reply);
    }
});
function stripUpDirs(path) {
    var split = path.split('/..');
    return split.filter(function (s) { return s !== ''; }).join('');
}
function postHandler(message, response, routeHandler, wildcard) {
    var body = '';
    var error = false;
    var parsed = parseUrl(message.url);
    var formParser = new forms.IncomingForm();
    var callback = function (err, fields) {
        var handler = routeHandler.handler;
        handler({ body: fields, path: parsed.path, wildcard: wildcard, query: {} }, toReply(response));
    };
    formParser.parse(message, callback);
}
function toReply(response) {
    var reply = function (data, statusCode) {
        if (reply.called)
            return logger.error(errors.ReplyOnlyOnce);
        reply.called = true;
        response.statusCode = statusCode || 200;
        response.write(data);
        response.end();
    };
    reply.called = false;
    reply.file = function (filePath) {
        // TODO: Implement me!!
        fs.readFile(filePath, 'utf8', function (err, data) {
            if (err)
                return reply("Unable to load file: " + filePath, 404);
            reply(data);
        });
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
module.exports = server;
//# sourceMappingURL=index.js.map