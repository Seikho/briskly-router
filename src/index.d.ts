import http = require('http');

export class Router {
    constructor(options?: ServerOptions);

    port: number;
    host: string;
    handle(message: http.IncomingMessage, response: http.ServerResponse): void;
    start(callback?: (err?) => void): Promise<void>;
    stop(callback?: () => void): Promise<void>;
    route(options: RouteOptions): void;
    connection(options: ServerOptions): void;
}

export var version: string;

export interface ServerOptions {
    port?: number;
    host?: string;
    error?: RouteHandler | DirectoryHandler | FileHandler;
}

export interface RouteHandler {
    (response: Response, reply: Reply): void;
}

export interface DirectoryHandler {
    directory: string;
}

export interface FileHandler {
    file: string;
}

export interface Response {
    query?: any;
    body?: any;
    params?: any;
    path: string;
    wildcard?: string;
    message: IncomingMessage;
}

export interface Reply {
    (data: any, statusCode?: number)
    file: (filePath: string) => void;
    html: (markup: string) => void;
    headers: Headers;
    statusCode: number;
}

export interface Headers {
    [index: string]: string;
}

export interface Session {
    [index: string]: any;
}

export interface Route {
    parts: Array<RoutePart>;
    options: RouteOptions;
}

export interface RouteOptions {
    method: string;
    path: string;
    handler: RouteHandler | DirectoryHandler | FileHandler;
    error?: RouteHandler | DirectoryHandler | FileHandler;
}

export interface RoutePart {
    cast?: string;
    part: string;
    type: string;
    prefix?: string
    suffix?: string;
}

export interface Request {
    parts: Array<RequestPart>;
    method: string;
    path: string;
}

export interface RequestPart {
    part: string;
    value: any;
    cast: string;
}

export interface IncomingMessage {
    httpVersion: string;
    headers: any;
    rawHeaders: string[];
    trailers: any;
    rawTrailers: any;

    /**
     * Only valid for request obtained from http.Server.
     */
    method?: string;
    /**
     * Only valid for request obtained from http.Server.
     */
    url?: string;
    /**
     * Only valid for response obtained from http.ClientRequest.
     */
    statusCode?: number;
    /**
     * Only valid for response obtained from http.ClientRequest.
     */
    statusMessage?: string;
    socket: any;
}
