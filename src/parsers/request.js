function parse(request) {
    var qsMarker = request.indexOf('?');
    var route = qsMarker === -1 ? request : request.slice(0, qsMarker);
    var parts = route.slice(1).split('/');
    return parts.map(getTypes);
}
function isNumber(input) {
    if (input === 'Infinity' || input === '-Infinity')
        return false;
    return !isNaN(input);
}
function toNumber(input) {
    if (!isNumber)
        return null;
    return {
        type: 'number',
        value: Number(input)
    };
}
function toString(input) {
    if (isNumber(input))
        return null;
    return {
        type: 'string',
        value: input
    };
}
function toArray(input) {
    try {
        var value = JSON.parse(input);
        if (!Array.isArray(value))
            return null;
        return {
            type: 'array',
            value: value
        };
    }
    catch (ex) {
        return null;
    }
}
function toObject(input) {
    try {
        var value = JSON.parse(input);
        if (value instanceof Array)
            return null;
        if (value instanceof String)
            return null;
        if (isNumber(input))
            return null;
        return {
            type: 'object',
            value: value
        };
    }
    catch (ex) {
        return null;
    }
}
var casters = [toString, toNumber, toArray, toObject];
function getTypes(part) {
    var type = casters.reduce(function (prev, curr) {
        if (typeof prev !== 'undefined')
            return prev;
        var type = curr(part);
        return type;
    }, null);
    type.part = part;
    return type;
}
module.exports = parse;
//# sourceMappingURL=request.js.map