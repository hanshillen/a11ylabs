

export let $ = function (selector: string, node: Element | HTMLDocument = document) {
    return node.querySelector(selector) as Element;
};
export let $$ = function (selector: string, node: Element | HTMLDocument = document) {
    return node.querySelectorAll(selector) as NodeListOf<Element>;
};