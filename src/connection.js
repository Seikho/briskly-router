exports.port = 2189;
exports.host = 'localhost';
function connection(options) {
    if (options.port)
        exports.port = options.port;
    if (options.host)
        exports.host = options.host;
}
exports.connection = connection;
//# sourceMappingURL=connection.js.map