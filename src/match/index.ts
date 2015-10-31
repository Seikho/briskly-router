import Match = Types.Match;
import routes = require('../routes');
import log = require('ls-logger');
import toRequest = require('./request');
import best = require('./best');
export = match;

function match(path: string, method: string): Types.Route {
    method = method.toUpperCase();
    var request = toRequest(path, method);   

    return best(request);
}