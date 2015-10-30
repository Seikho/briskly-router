function isMatch(request, route) {
    if (route.type === 'route')
        return request.part === route.part
            ? 0 /* Part */
            : 3 /* None */;
    if (route.type === 'wildcard')
        return 4 /* Wildcard */;
    if (route.cast === 'any')
        return 2 /* Any */;
    return route.cast === request.cast
        ? 1 /* Type */
        : 3 /* None */;
}
module.exports = isMatch;
//# sourceMappingURL=part.js.map