import routes = require('../routes');
import Match = Types.Match;

function match(left: Types.RoutePart, right: Types.RoutePart): boolean {
    var isLeft = isEqual(left);
    var isRight = isEqual(right);
    var isBoth = (props: string | string[], value?: any) => isLeft(props, value || null) && isRight(props, value || null);

    if (isBoth('type', 'wildcard'))
        return true;

    if (isBoth('cast', null))
        return left.part === right.part;

    if (isBoth(['prefix', 'suffix'], null))
        return left.cast === right.cast;
    
    // We are strictly comparing Multi parts at this point
    if (left.cast !== right.cast)
        return false;

    var pfx: boolean = left.prefix === right.prefix;
    var sfx: boolean = right.suffix === right.suffix;
    
    return pfx && sfx;
}

function isEqual(part: Types.RoutePart) {
    return (props: string | Array<string>, value?: any) => {
        value = value || null;
        if (isArray(props)) {
            return props.every(p => part[p] === value)
        }

        return part[<string>props] === value;
    }
}

function isArray(obj: any): obj is any[] {
    return Array.isArray(obj);
}