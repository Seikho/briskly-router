function parse(request) {
    var qsMarker = request.indexOf('?');
    var route = qsMarker === -1 ? request : request.slice(0, qsMarker);
    var parts = route.split('/');
    return parts.map(getTypes);
}
function toNumber(input) {
    if (input === 'Infinity' || input === '-Infinity')
        return null;
    if (isNaN(input))
        return null;
    return {
        type: 'number',
        value: Number(input)
    };
}
function toString(input) {
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
        if (value instanceof Number)
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
    var types = casters.reduce(function (prev, curr) {
        var type = curr(part);
        if (!type)
            return prev;
        return [type].concat(prev);
    }, []);
    var part = {
        part: part,
        types: types
    };
}
module.exports = parse;
//# sourceMappingURL=request.js.map