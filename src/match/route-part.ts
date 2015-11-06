import Types = require('../index.d.ts');
import Match = Types.Match;
export = match;

function match(left: Types.RoutePart, right: Types.RoutePart): Match {
    var isLeft = isEqual(left);
    var isRight = isEqual(right);
    var isBoth = (props: string | string[], value?: any) => isLeft(props, value || null) && isRight(props, value || null);

    if (isBoth('type', 'wildcard'))
        return Match.Wildcard;

    if (isBoth('cast', null))
        return left.part === right.part
            ? Match.Part
            : Match.None;

    if (isBoth(['prefix', 'suffix'], null))
        return left.cast === right.cast
            ? Match.Type
            : Match.None;
    
    // We are strictly comparing Multi parts at this point
    if (left.cast !== right.cast)
        return Match.None;

    var pfx: boolean = left.prefix === right.prefix;
    var sfx: boolean = left.suffix === right.suffix;

    return pfx && sfx
        ? Match.Multi
        : Match.None;
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