var http = require('http');
var match = require('../match');
var forms = require('formidable');
var qs = require('querystring');
var fs = require('fs');
var server = http.createServer();
server.on('request', function (message, response) {
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
    route.options.handler({ query: query, path: path, wildcard: wildcard, body: {} }, toReply(response));
});
function postHandler(message, response, routeHandler, wildcard) {
    var body = '';
    var error = false;
    var parsed = parseUrl(message.url);
    var formParser = new forms.IncomingForm();
    var callback = function (err, fields) {
        routeHandler.handler({ body: fields, path: parsed.path, wildcard: wildcard, query: {} }, toReply(response));
    };
    formParser.parse(message, callback);
}
function toReply(response) {
    var reply = function (data, statusCode) {
        response.statusCode = statusCode || 200;
        response.write(data);
        response.end();
    };
    reply.file = function (filePath) {
        // TODO: Implement me!!
        fs.readFile(filePath, 'utf8', function (err, data) {
            if (err)
                throw new Error(err.message);
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
module.exports = server;
//# sourceMappingURL=index.js.map