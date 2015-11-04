declare module Types {
    function start(callback?: Callback);

    function stop(callback?: Callback);

    function route(options: RouteOptions): void;
    
    function connection(options: ServerOptions): void;
    
    var version: string;
    
    interface ServerOptions {
        port?: number;
        host?: string;
        error?: RouteHandler|DirectoryHandler|FileHandler;
    }

    interface RouteHandler {
        (response: Response, reply: Reply): void;
    }
    
    interface DirectoryHandler {
        directory: string;
    }
    
    interface FileHandler {
        file: string;
    }

    interface Response {
        query?: any;
        body?: any;
        params?: any;
        path: string;
        wildcard?: string;
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
        handler: RouteHandler|DirectoryHandler|FileHandler;
        error?: RouteHandler|DirectoryHandler|FileHandler;
    }

    interface RoutePart {
        cast?: string;
        part: string;
        type: string;
        prefix?: string
        suffix?: string;
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
        Part = 0,
        Type = 1,
        Any = 2,
        None = 3,
        Wildcard = 4,
        Multi = 5
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