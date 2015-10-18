export function start(callback?: Callback);

export function stop(callback?: Callback);

export function route(options: RouteOptions): void;

export function parse(route: string): RouteHandler;

export interface RouteHandler {
    (response: Response, reply: Reply): void;
}

export interface Response {
    query?: any;
    body?: any;
    path: string;
}

export interface Reply {
    (data: any, statusCode?: number)
    file: (filePath: string) => void;
}

export interface Session {
    [index: string]: any;
}

export interface RouteOptions {
    method: string;
    path: string;
    handler: RouteHandler;
}

export interface Callback {
    (error?: any, data?: any): void;
}

export interface RoutePart {
    type: string;
    cast?: string;
    part: string;
}

export interface PegParser<T> {
   parse(input: string): T; 
}