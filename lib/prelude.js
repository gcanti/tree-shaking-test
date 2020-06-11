import * as E from "fp-ts/es6/Either";
var Either = {
    map: E.map,
    chain: E.chain,
    right: E.right,
    chainFirst: E.chainFirst,
    duplicate: E.duplicate,
    traverse: E.traverse,
    sequence: E.sequence,
    getValidation: E.getValidation
};
export { Either };
export * from "fp-ts/es6/function";
