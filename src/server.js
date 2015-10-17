var http = require('http');
var match = require('./match');
var forms = require('formidable');
var qs = require('querystring');
var server = http.createServer();
server.on('request', function (message, response) {
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
    routeHandler.handler({ query: query, path: path }, toReply(response));
});
var postHandler = function (message, response, routeHandler) {
    var body = '';
    var error = false;
    var parsed = parseUrl(message.url);
    var formParser = new forms.IncomingForm();
    // Fetch callback for route
    formParser.parse(message, function (err, fields, files) {
        routeHandler.handler({
            body: fields,
            path: parsed.path
        }, toReply(response));
    });
};
function toReply(response) {
    var reply = function (data, statusCode) {
        response.statusCode = statusCode || 200;
        response.write(data);
        response.end();
    };
    reply.file = function (filePath) {
        // TODO: Implement me!!
        reply(filePath);
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
module.exports = server;
//# sourceMappingURL=server.js.map