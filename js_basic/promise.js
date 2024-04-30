/*
var pro1 = new Promise(function(resolve, reject){
    setTimeout(function(){  //1초후 실행됨
        resolve('success');
    }, 1000);
});

pro1.then(function(result){
    console.log('result:', result);
});
*/

function pro1(){
    return new Promise(function(resolve, reject){
        setTimeout(function(){  //1초후 실행됨
            //resolve('pro1 success');
            reject('pro1 fail');
        }, 1000);
    });
}

function pro2(){
    return new Promise(function(resolve, reject){
        setTimeout(function(){  //1초후 실행됨
            resolve('pro2 success');
        }, 1000);
    });
}

//호출(콜백 지옥)
/*pro1().then(function(result){
    console.log('result', result);
    pro2().then(function(result){
        console.log('result2', result);
    })
})*/

//프로미스 체이닝
pro1()
.then(function(result){
    console.log('result1', result);
    return pro2();
})
.catch(function(err){
    console.log('err', err);
    return Promise.reject(err);
})
.then(function(result){
    console.log('result2', result);
})