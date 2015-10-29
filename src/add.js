var routes = require('./routes');
var routeParser = require('./parsers/route');
function add(options) {
    var parts = routeParser(options.path);
    options.method = options.method.toUpperCase();
    // TODO: Chcek for ambiguous routes
    routes.push({
        options: options,
        parts: parts
    });
}
module.exports = add;
//# sourceMappingURL=add.js.map