"use strict";

const T_Root = "__ROOT__";
const T_Statement = "Statement";
const T_Assignment = "Assignment";
const T_Identifier = "Identifier";
const T_AssignmentOperator = "AssignmentOperator";
const T_Semicolon = "Semicolon";

const R_Identifier = /^[a-zA-Z_][a-zA-Z0-9_]*/;

let errors = [];

class Node {
    constructor(token, text) {
        this.token = token;
        this.text = text;
        this.children = [];
    }

    add(node) {
        this.children.push(node);
        return node;
    }
}

class ParseResult {
    constructor() {
        this.text = null;
        this.length = 0;
    }
}

function parse(code) {
    let root = new Node(T_Root, "");
    let pos = 0;
    let length = 0;
    while (length = parseStatement(root, code, pos)) {
        if (length === 0) {
            break;
        }
        pos += length;
    }
    return root;
}

function parseStatement(parent, code, pos) {
    /*
        Statement = Assignment Semicolon;
    */

    let node = new Node(T_Statement, "");
    console.log(pos, "ParseStatement");

    let newPos = pos + parseAssignment(node, code, pos);
    if (newPos === pos) {
        return 0;
    }

    let res = null;

    if (!(res = expect(T_Semicolon, node, code, newPos))) {
        return 0;
    }
    newPos = res;

    parent.add(node);
    return newPos - pos;
}

function parseAssignment(parent, code, pos) {
    /*
        Assignment = Identifier AssignmentOperator AssignmentExpression
    */

    let node = new Node(T_Assignment, "");
    console.log(pos, "ParseAssignment");

    let res = expect(T_Identifier, node, code, pos);
    if (!res) {
        return 0;
    }
    let newPos = res;

    if (!(res = expect(T_AssignmentOperator, node, code, newPos))) {
        return 0;
    }
    newPos = res;

    parent.add(node);
    return newPos - pos;
}

function expect(token, parent, code, pos) {
    let result = parseToken(token, code, pos);
    if (!result) {
        console.error(token, "expected.");
        return null;
    }
    parent.add(new Node(token, result.text));
    return pos + result.length;
}

function parseToken(token, code, pos) {
    console.log(pos, "ParseToken", token);
    let parseResult = new ParseResult();
    let match = null;
    parseResult.length += parseWhitespace(code, pos);
    switch (token) {
        case T_Identifier:
            match = code.substring(pos + parseResult.length).match(R_Identifier);
            if (!match) {
                return null;
            }
            parseResult.text = match[0];
            parseResult.length += match[0].length;
            return parseResult;
        case T_AssignmentOperator:
            if (code[pos + parseResult.length] !== ':') {
                return null;
            }
            parseResult.text = ':';
            parseResult.length += 1;
            return parseResult;
        case T_Semicolon:
            if (code[pos + parseResult.length] !== ';') {
                return null;
            }
            parseResult.text = ';';
            parseResult.length += 1;
            return parseResult;
        default:
            console.error("ParseToken: token unknown:", token);
            return null;
    }
}

function parseWhitespace(code, pos) {
    let end = 0;
    const spaceChars = [' ', '\t', '\n'];
    while (pos + end < code.length && spaceChars.includes(code[pos + end])) {
        end++;
    }
    return end;
}