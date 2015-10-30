function isMatch(request, route) {
    var safeRoute = route || { type: 'wildcard', part: '*' };
    if (safeRoute.type === 'route')
        return request.part === safeRoute.part
            ? 0 /* Part */
            : 3 /* None */;
    if (safeRoute == null || safeRoute.type === 'wildcard')
        return 4 /* Wildcard */;
    if (safeRoute.cast === 'any')
        return 2 /* Any */;
    return safeRoute.cast === request.cast
        ? 1 /* Type */
        : 3 /* None */;
}
module.exports = isMatch;
//# sourceMappingURL=part.js.map