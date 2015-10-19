import Types = require('../../index.d.ts');
import fs = require('fs');
import path = require('path');
var PEG = require('pegjs');

export = parser.parse;

var grammar = fs.readFileSync(path.join(__dirname, 'route.peg')).toString();
var parser: Types.PegParser<Types.RoutePart[]> = PEG.buildParser(grammar);