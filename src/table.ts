import routes = require('./routes');
import Types = require('../index.d.ts');

var table: Table = {};

export function add(route: Types.RouteOptions) {

}

export function toPath(path: string) {
    var lastSlash = path.lastIndexOf('/') + 1;
    var path = path.slice(0, lastSlash);
    var end = path.slice(lastSlash);
}

interface Table {
    [path: string]: Array<Route>;
}

interface Route {
    name: string;
    route: Types.RouteOptions;
}

interface Path {
    path: string;
    end: string;
}