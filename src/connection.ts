export var port: number = null;

export var host = 'localhost';

export function connection(options: Types.ServerOptions) {
    if (options.port) port = options.port;
    if (options.host) host = options.host;
}