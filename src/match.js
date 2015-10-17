function match(path) {
    var options = {
        method: 'GET',
        path: path,
        handler: function (req, reply) {
            console.log(req);
            reply('success');
        }
    };
    return options;
}
module.exports = match;
//# sourceMappingURL=match.js.map