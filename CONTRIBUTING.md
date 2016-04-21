Clone the repository and run `npm install`  

## Compiling from source (Unix/Mac/Windows)
Prerequisities:
- Node.JS 0.12.7+
- NPM 2.*+

To build the project from source, ensure your CWD is somewhere in the project and:

```bash
npm install
npm run build
```


## Debugging
The project has launch tasks for Visual Studio Code (VSCode) already. In VSCode, simply hit `F5` and `debug/index.js` will run.  
You can set the break points in the TypeScript source.

### Node-inspector
Prerequisites:
- node-inspector (`npm install -g node-inspector)

To run the debug script:
```
node-debug debug/index.js
``` 
This will launch Chrome and use the Chrome developer tools for debugging


## Modifying
Modify the TypeScript (`*.ts`) files, not the JavaScript (`*.js`) files and re-build (`npm run build`).  
A VSCode build task has been configured, so simply hit `CTRL + SHIFT + B` to build or use the command line. 


## Contributing
Please create an issue before creating a pull request.