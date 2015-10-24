function isMatch(request, route) {
    if (route.type === 'route')
        return request.part === route.part
            ? 0 /* Part */
            : 2 /* None */;
    if (route.cast === 'any')
        return 1 /* Parameter */;
    return route.cast === request.cast
        ? 1 /* Parameter */
        : 2 /* None */;
}
module.exports = isMatch;
//# sourceMappingURL=part.js.map