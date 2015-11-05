function match(left, right) {
    var isLeft = isEqual(left);
    var isRight = isEqual(right);
    var isBoth = function (props, value) { return isLeft(props, value || null) && isRight(props, value || null); };
    if (isBoth('type', 'wildcard'))
        return true;
    if (isBoth('cast', null))
        return left.part === right.part;
    if (isBoth(['prefix', 'suffix'], null))
        return left.cast === right.cast;
    // We are strictly comparing Multi parts at this point
    if (left.cast !== right.cast)
        return false;
    var pfx = left.prefix === right.prefix;
    var sfx = right.suffix === right.suffix;
    return pfx && sfx;
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
//# sourceMappingURL=route-part.js.map