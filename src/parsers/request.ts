import Types = require('../../index.d.ts');
export = parse;

function parse(request: string) {
    var qsMarker = request.indexOf('?');
    var route = qsMarker === -1 ? request : request.slice(0, qsMarker);
    
    var parts = route.slice(1).split('/');
    return parts.map(getType);
}

function isNumber(input: any) {
    if (input === 'Infinity' || input === '-Infinity') return false;
    return !isNaN(input);
}

function toNumber(input: any) {
    if (!isNumber(input)) return null;

    return {
        type: 'number',
        value: Number(input)
    };
}

function toString(input: any) {
    if (isNumber(input)) return null;
    
    return {
        type: 'string',
        value: input
    };
}

function toArray(input: any) {
    try {
        var value = JSON.parse(input);
        if (!Array.isArray(value)) return null;
        return {
            type: 'array',
            value
        };
    }
    catch (ex) {
        return null;
    }
}

function toObject(input: any) {
    try {
        var value = JSON.parse(input);
        if (value instanceof Array) return null;
        if (value instanceof String) return null;
        if (isNumber(input)) return null;
        return {
            type: 'object',
            value
        };
    }
    catch (ex) {
        return null;
    }
}

var casters = [toString, toNumber, toArray, toObject];

function getType(part: string): Types.RequestPart {
    var addPart = (returnPart: any) => {
        returnPart.part = part;
        return returnPart;
    }
    
    var array = toArray(part);
    if (array) return addPart(array);
    
    var object = toObject(part);
    if (object) return addPart(object);
    
    var number = toNumber(part);
    if (number != null) return addPart(number);
    
    return addPart(toString(part));
}

