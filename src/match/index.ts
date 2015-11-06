import Types = require('../index.d.ts');
import Match = BR.Match;
import log = require('ls-logger');
import toRequest = require('./to-request');
import best = require('./best');
export = match;

function match(path: string, method: string, routes: Types.Route[]): Types.Route {
    method = method.toUpperCase();
    var request = toRequest(path, method);   

    return best(request, routes);
}