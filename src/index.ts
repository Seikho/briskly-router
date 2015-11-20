import Types = require('./index.d.ts');
import connection = require('./connection');
import route = require('./route');
import createServer = require('./server');
import Promise = require('bluebird');
import http = require('http');
import handler = require('./server/handler');
var pkg = require('../package.json');

export class Router {
    constructor(options?: Types.ServerOptions) {
        this.connection(options);
    }

    routes: Types.Route[] = [];
    server = createServer(this.routes);
    port: number = 2189;
    host: string = null;

    handle(message: http.IncomingMessage, response: http.ServerResponse) {
        handler(message, response, this.routes);
    }

    start(callback?: (err?) => void) {
        var p = Promise.defer();

        var promiseCb = (err?) => {
            if (err) p.reject(err);
            else p.resolve(void 0);

            if (callback) callback(err);
        }

        this.server.listen(this.port, this.host, promiseCb);

        return p;
    };

    stop(callback?: () => void) {
        var p = Promise.defer();

        var promiseCb = () => {
            p.resolve(void 0);
            if (callback) callback();
        }
        
        this.server.close(promiseCb);
        return p;
    }

    connection(options?: Types.ServerOptions) {
        if (!options) return;
        if (options.host) this.host = options.host;
        if (options.port) this.port = options.port;
    }

    route(options: Types.RouteOptions) {
        route(options, this.routes);
    }
}

export var version = pkg.version;

