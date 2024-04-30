
const readline = require("readline");

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
});

/*rl.question("단을 입력: ", function(dan){
    for(var i=1; i<10; i++){
        console.log(dan + ' * ' + i + " = " + dan * i);
    }
    rl.close();
});*/

/*var i = 0;
for(; i < 101;){
    console.log("충전중 : " + i + "%<br/>");
    i++;
}*/

var dan = 2;
while(dan < 10){
    var num = 1;
    while(num < 10){
        console.log(dan + "*" + num + "=" + dan*num);
        num++;
    }
    dan++;
}