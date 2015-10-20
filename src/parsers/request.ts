import Types = require('../../index.d.ts');
export = parse;

function parse(request: string) {
    var parts = request.split('/');

    return parts.map(getTypes);
}

function toNumber(input: any) {
    if (input === 'Infinity' || input === '-Infinity') return null;
    if (isNaN(input)) return null;

    return {
        type: 'number',
        value: Number(input)
    };
}

function toString(input: any) {

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
        if (value instanceof Number) return null;
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

function getTypes(part: any) {

    var types = casters.reduce((prev, curr) => {
        var type = curr(part);
        if (!type) return prev;

        return [type].concat(prev);
    }, []);

    var part: any = {
        part,
        types
    }
}

