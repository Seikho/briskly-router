var table = {};
function add(route) {
}
exports.add = add;
function toPath(path) {
    var lastSlash = path.lastIndexOf('/') + 1;
    var path = path.slice(0, lastSlash);
    var end = path.slice(lastSlash);
}
exports.toPath = toPath;
//# sourceMappingURL=table.js.map