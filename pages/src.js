export const SOURCE = `/** 環境
 * next 10.2.2
 * react 17.0.2
 * wabpack 4系
 * target edge 11 
 **/

/** 事前準備 **/
// オブジェクト
const object = {first: "this is first string value"};
// ネストされたオブジェクト
const nestedObject = {first: {second: {third: "this is third value"} } };
// 配列
const array = [1, 2, 3, 4]
// ネストされた配列
const nestedArray = [1, 2, 3, [4, 5, [6, 7, 6]]]


/** Edge 16 でエラーになる構文例 **/
// これはエラーになる
const fn1 = ({ a = 1 }) => {};

// エラーにならない
function fn2({ a = 1, b }, ...args) {}

// エラーにならない
const fn3 = ({ a: a = 1 }) => {};

`;

export const BABEL_CONFIG = `{
  "filename": "a.ts",
  "presets": [
    [
      "@babel/preset-env",
      {
        "targets": {
          "edge": 11
        }
      }
    ],
    "@babel/preset-typescript"
  ],
  "plugins": []
}`;
