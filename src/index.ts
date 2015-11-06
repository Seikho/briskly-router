import Types = require('./index.d.ts');
import connection = require('./connection');
import route = require('./route');
import createServer = require('./server');
import Promise = require('bluebird');
var pkg = require('../package.json');

export class Router {
    constructor(options?: Types.ServerOptions) {
        this.connection(options);
    }

    server = createServer();
    port: number = 2189;    
    host: string = null;

    start(callback?: (err?) => void) {
        var p = new Promise<void>((resolve, reject) => {

            var promiseCb = (err?) => {
                if (err) reject(err);
                else resolve(void 0);

                if (callback) callback(err);
            }
            this.server.listen(this.port, this.host, promiseCb);
        });
        return p;
    };

    stop(callback?: () => void) {
        var p = new Promise<void>(resolve => {

            var promiseCb = () => {
                resolve(void 0);
                if (callback) callback();
            }
            this.server.close(promiseCb);
        });
        return p;
    }
    
    connection(options?: Types.ServerOptions) {
        if (!options) return;
        if (options.host) this.host = options.host;
        if (options.port) this.port = options.port;
    }
    
    routes: Types.Route[] = [];

    route = route(this);
}

var version = pkg.version;

