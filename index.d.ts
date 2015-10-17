export function start(callback?: Callback);

export function stop(callback?: Callback);

export function route(options: RouteOptions): void;

export function parse(route: string): RouteHandler;

export interface RouteHandler {
    (response: Response, reply: Reply): void;
}

export interface Response {
    query: any;
    body: any;
}

export interface Reply {
    (data: any, statusCode?: number)
}

export interface Session {
    
}

export interface RouteOptions {
    method: string;
    path: string;
    handler: RouteHandler;
}

export interface Callback {
    (error?: any, data?: any): void;
}