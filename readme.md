### Briskly-Router
Route handling for Node with types!

[![NPM version](http://img.shields.io/npm/v/briskly-router.svg?style=flat)](https://www.npmjs.org/package/briskly-router)
[![Travis build status](https://travis-ci.org/Seikho/briskly-router.svg?branch=master)](https://travis-ci.org/Seikho/briskly-router)

### Types???
See: [Routing](#routing)   
Types annotations are allowed in route parameters to define more granular routes.  
For example: Given the routes `/users/{id: number}` and `/users/{id: string}`  
A request to `/users/123` will only match the `{id: number}` route.  
A request to `/users/seikho` will only match the `{id: string}` route.  
Since we have no route that matches an `array` or `object`, `/users/[1,2,3]` will not match either route.

### Installation
```
npm install briskly-router --save
```

### Basic Usage
`briskly-router` will check [briskly.json](#briskly-json) for routes and server configuration.
```javascript
import BR = require('briskyl-router');

BR.connection({
    port: 2189,
    host: 'localhost'
});

BR.route({
    method: 'GET',
    path: '/',
    handler: {
        file: 'front/index.html'
    }
});

BR.route({
    method: 'GET',
    path: '/users/{id: number}',
    handler: (request, reply) => getUserById(request.params.id).then(reply)
});

BR.start();

// some time later

BR.stop();
```

### Configuration
The configuration `port` and `host` can be configured in code or in [briskly.json](#brisklyjson).  
**NB**: The configuration in code will override `briskly.json`.  
See [connection(...)](#connection) 
  
### Briskly JSON
The `port` and `host` can be defined in `briskly.json`.
```json
{
    "host": "localhost",
    "port": 2189
}
``` 
Exmaple: See the this sample [briskly.json](https://github.com/Seikho/briskly/blob/master/briskly.json).

### Routing
A route is defined by its `parts` which are separated by a forward slash (`/`).  
Routes **do not** need to be defined in order and will always use the **most specific route** 
An example route table: 
- `/`
- `/{...}` -- A catch all route that will match where everything else does not
- `/scripts/{...}` -- Will match `/scripts/[anything here]/[and here...]/so on..`
- `/users/{id: number}` -- Will match `/users/42`
- `/users/{name: string}`  -- Will match `/users/seikho`
- `/users` -- Will only `/users`
  
Allowed parts:
- **Part**: An exact string. E.g. `/my-home`
- **Parameters**:
 - `{myparam}`: E.g. `/{myparams}`
- **Typed Parameters**:
 - `string`: `/{someWord: string}`
 - `number`: `/{anumber: number}`
 - `array`: `/{myArray: array}`
 - `object`: `/{myObj: object}`
 - `any`: `{someParam: any}`
- **Wildcard**
 - Must be at the end of a route path
 - E.g.: `/{...}`
 - Another: `/scripts/{...}`
 
### API

#### route
Adds a route to the route table
See: [Routing](#routing) [RouteOptions](#routeoptions)
```javascript
function route(options: RouteOptions)
```
Examples
```javascript
route({ method: 'get', path: '/scripts/{...}', handler: directory: { 'front/scripts' } });

route({ method: 'get', path: '/api/users', handler: (req, reply) => getUsers.then(reply) });

route({ method: 'get', path: '/api/user/{id: number}', handler: (req, reply) => getUser(req.params.id).then(reply) });

route({ method: 'get', path: '/api/user/{name: string}', handler: (req, reply) => getUserByName(req.params.name).then(reply) });

route({ method: 'get', path: '/', handler: { file: 'front/index.html' } });
```

#### connection
See: [ServerOptions](#serveroptions)  
Set the listening port and/or host
```javascript
function connection(options: ServerOptions): void;
``` 

#### start
See: [briskly.json](#briskly-json)  
Starts the web server listener.  
This will parse `briskly.json` and use the `port` key
```javascript
function start(callback: () => void): void;
```

#### stop
Stops the web server listener.  
```javascript
function stop(callback: () => void): void;
```

#### ServerOptions
```javascript
interface ServerOptions {
    port?: number;
    host?: string;
}
```

#### RouteOptions
See: [RouteHandler](#routehandler) [DirectoryHandler](#directoryhandler) [FileHandler](#filehandler)
```javascript
interface RouteOptions {
    method: string; // GET, POST, PUT, DELETE, etc...
    path: string;
    handler: RouteHandler|DirectoryHandler|FileHandler
}
```

#### RouteHandler
See: [Response](#response) [Reply](#reply)
```javascript
function(response: Response, reply: Reply)
```

#### DirectoryHandler
```javascript
interface DirectoryHandler {
    // The base directory to append the request file path to
    directory: string;
}
```

#### FileHandler
```javascript
interface FileHandler {
    // The relative path of the file
    file: string;
}
```

#### Response
The object provided to the `RouteHandler` function
```javascript
interface Response {
    query?: any;
    body?: any;
    params?: any;
    path: string;
    wildcard?: string;
}
```

#### Reply
The function use to send a response to the client
```javascript
interface Reply {
    (data: any, statusCode?: number)
    file: (filePath: string) => void;
}
```

### TODOS
- Disallow ambiguous routes
- Allow `catch`/`error` handlers
 - Provide a default catch handler
 - Provide specific catch folders for routes
- Allow optional parameters
### License
MIT
