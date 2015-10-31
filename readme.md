### Briskly-Router
Route handling for Node with Types

[![NPM version](http://img.shields.io/npm/v/briskly-router.svg?style=flat)](https://www.npmjs.org/package/briskly-router)
[![Travis build status](https://travis-ci.org/Seikho/briskly-router.svg?branch=master)](https://travis-ci.org/Seikho/briskly-router)

### Installation
```
npm install briskly-router --save
```

### Basic Usage
`briskly-router` will check [briskly.json](#briskly-json) for routes and server configuration.
```javascript
import BR = require('briskyl-router');

BR.route({ /* options here */};

BR.start();

// some time later

BR.stop();
```
  
### Briskly JSON
The `port` must be defined in `briskly.json`. 
Exmaple: See the this sample [briskly.json](https://github.com/Seikho/briskly/blob/master/briskly.json).

### Routing
A route is defined by its `parts`.
Example: `/part1/part2/part3/part4  
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

#### start
See: [briskly.json](#briskly-json)  
Starts the web server listener.  
This will parse `briskly.json` and use the `port` key
```javascript
function start(callback: () => void);
```

#### stop
Stops the web server listener.  
```javascript
function stop(callback: () => void);
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

### License
MIT