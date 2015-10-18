import Types = require('../../index.d.ts');
var PEG = require('pegjs');
var grammar = require('./route.peg');
export = parser;

var parser: Types.PegParser<Types.RoutePart[]> = PEG.buildParser(grammar);