function isMatch(request, route) {
    if (route == null)
        return null;
    if (route.type === 'route')
        return request.part === route.part
            ? 0 /* Literal */
            : 3 /* None */;
    if (route.type === 'multi') {
        var pfx = (route.prefix || '');
        var sfx = (route.suffix || '');
        var prefixMatch = route.prefix == null || request.part.slice(0, pfx.length) === pfx;
        var suffixMatch = route.suffix == null || request.part.slice(-sfx.length) === sfx;
        return prefixMatch && suffixMatch
            ? 5 /* Mixed */
            : 3 /* None */;
    }
    if (route.type === 'wildcard')
        return 4 /* Wildcard */;
    if (route.cast === 'any')
        return 2 /* Any */;
    return route.cast === request.cast
        ? 1 /* Type */
        : 3 /* None */;
}
module.exports = isMatch;
//# sourceMappingURL=request-part.js.map