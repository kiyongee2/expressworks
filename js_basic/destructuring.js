const { log } = require("console");

const color = ['red', 'green', 'blue'];

// let r = color[0];
// let g = color[1];
// let b = color[2];

let [r, g, b] = color;  //비구조화 할당(배열)

[b, g, r] = [r, g, b];
console.log(b);
console.log(g);
console.log(r);

const [d, e, f='C언어'] = ['C#', 'javascript'];
console.log(d);
console.log(e);
console.log(f);

const [m, n, ...rest] = ['C#', 'javascript', 'python', 'react', 'C++'];
console.log(m);
console.log(n);
console.log(rest.length);
console.log(rest[0]);

const arr1 = ['apple', 'banana'];
const arr2 = ['dog', 'cat', 'cow'];
const arr3 = [...arr1, ...arr2];

console.log(arr3);

let user = {
    id: 'jamsuham',
    pw: '1234',
    name: '잠수함',
    age: 30
}

let {id, pw, name, age} = user;  //비구조화 할당(객체)

console.log(id);
console.log(pw);