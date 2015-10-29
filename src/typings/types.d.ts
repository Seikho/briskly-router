declare module Types {
    function start(callback?: Callback);

    function stop(callback?: Callback);

    function route(options: RouteOptions): void;

    function parse(route: string): RouteHandler;

    interface RouteHandler {
        (response: Response, reply: Reply): void;
    }

    interface Response {
        query?: any;
        body?: any;
        path: string;
    }

    interface Reply {
        (data: any, statusCode?: number)
        file: (filePath: string) => void;
    }

    interface Session {
        [index: string]: any;
    }

    interface Route {
        parts: Array<RoutePart>;
        options: RouteOptions;
    }

    interface RouteOptions {
        method: string;
        path: string;
        handler: RouteHandler;
    }

    interface RoutePart {
        cast?: string;
        part: string;
        type: string;
    }

    interface Request {
        parts: Array<RequestPart>;
        method: string;
        path: string;
    }

    interface RequestPart {
        part: string;
        value: any;
        cast: string;
    }

    const enum Match {
        Part,
        Type,
        Any,
        None
    }

    interface Callback {
        (error?: any, data?: any): void;
    }

    interface PegParser<T> {
        parse(input: string): T;
    }
}

declare module "Types" {
    import API = Types;
    export = API;
}