import Types = require('../../index.d.ts');
export = parse;

const WORD = /[a-zA-Z0-9]+/;
const NUMBER = /[0-9]+/;


function parse(request: string) {
    return request.split('/');
}