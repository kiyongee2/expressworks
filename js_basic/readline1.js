
const readline = require('readline');

//콘솔에서 입력 받기
const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

/*
rl.question ('언어 입력: ', function(data){
    console.log(data + "입니다.");
    rl.close();
});
*/
/*
rl.question('정수 입력: ', function(num){
    if(num % 2){
        console.log('홀수입니다.');
    }
    else{
        console.log('짝수입니다.');
    }
    rl.close();
});*/

rl.question('나이 입력: ', function(age){
    if(age >= 19 && age <= 120){
        console.log('성인입니다.');
    }
    else if(age >= 0 && age < 19){
        console.log("미성년자입니다.");
    }
    else{
        console.log('값이 유효하지 않습니다.');
    }
    rl.close();
});
    
