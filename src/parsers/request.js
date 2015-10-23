function parse(request) {
    var qsMarker = request.indexOf('?');
    var route = qsMarker === -1 ? request : request.slice(0, qsMarker);
    var parts = route.slice(1).split('/');
    return parts.map(getType);
}
function isNumber(input) {
    if (input === 'Infinity' || input === '-Infinity')
        return false;
    return !isNaN(input);
}
function toNumber(input) {
    if (!isNumber(input))
        return null;
    return {
        cast: 'number',
        value: Number(input)
    };
}
function toString(input) {
    if (isNumber(input))
        return null;
    return {
        cast: 'string',
        value: input
    };
}
function toArray(input) {
    try {
        var value = JSON.parse(input);
        if (!Array.isArray(value))
            return null;
        return {
            cast: 'array',
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
            cast: 'object',
            value: value
        };
    }
    catch (ex) {
        return null;
    }
}
var casters = [toString, toNumber, toArray, toObject];
function getType(part) {
    var addPart = function (returnPart) {
        returnPart.part = part;
        return returnPart;
    };
    var array = toArray(part);
    if (array)
        return addPart(array);
    var object = toObject(part);
    if (object)
        return addPart(object);
    var number = toNumber(part);
    if (number != null)
        return addPart(number);
    return addPart(toString(part));
}
module.exports = parse;
//# sourceMappingURL=request.js.map