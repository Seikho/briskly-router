import routes = require('./routes');
import routeParser = require('./parsers/route');

var table: Table = {};

export function add(route: Types.RouteOptions) {

}

export function toPath(path: string) {
    var routeParts = routeParser(path);
    
}

interface Table {
    [path: string]: Array<Route>;
}

interface Route {
    name: string;
    route: Types.RouteOptions;
    parts: Types.RoutePart[]
}

interface Path {
    path: string;
    end: string;
}