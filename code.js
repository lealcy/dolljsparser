"use strict";

let textarea = document.querySelector("#code");
let result = document.querySelector("#result");

textarea.addEventListener('input', change, false);

function change(e) {
    let p = parse(textarea.value);
    let r = drawNode(p, 0);
    result.innerHTML = r;
}

function drawNode(n, l) {
    let r = "";
    for (let i = 0; i < l; i++) {
        r += '  ';
    }
    r += `${n.token}, "${n.text}"\n`;
    for (let i = 0; i < n.children.length; i++) {
        r += drawNode(n.children[i], l + 1);
    }
    return r;
}