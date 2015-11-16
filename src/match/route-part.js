function match(left, right) {
    var isLeft = isEqual(left);
    var isRight = isEqual(right);
    var isBoth = function (props, value) { return isLeft(props, value || null) && isRight(props, value || null); };
    if (isBoth('type', 'wildcard'))
        return 4 /* Wildcard */;
    if (isBoth('cast', null))
        return left.part === right.part
            ? 0 /* Literal */
            : 3 /* None */;
    if (isBoth(['prefix', 'suffix'], null))
        return left.cast === right.cast
            ? 1 /* Type */
            : 3 /* None */;
    // We are strictly comparing Multi parts at this point
    if (left.cast !== right.cast)
        return 3 /* None */;
    var pfx = left.prefix === right.prefix;
    var sfx = left.suffix === right.suffix;
    return pfx && sfx
        ? 5 /* Mixed */
        : 3 /* None */;
}
function isEqual(part) {
    return function (props, value) {
        value = value || null;
        if (isArray(props)) {
            return props.every(function (p) { return part[p] === value; });
        }
        return part[props] === value;
    };
}
function isArray(obj) {
    return Array.isArray(obj);
}
module.exports = match;
//# sourceMappingURL=route-part.js.map