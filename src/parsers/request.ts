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
    if (!isNumber) return null;

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

function getType(part: string): Types.Part {

    var type = casters.reduce((prev, curr) => {
        if (prev != null) return prev;         
        return curr(part);
    }, null);

    type.part = part;    
    return type;
}

