
const DB = []

function saveDB(user, callback){
    const oldDBSize = DB.length;
    DB.push(user);
    console.log(`save ${user.name} to DB`);
    return new Promise((resolve, reject) => {
        if(DB.length > oldDBSize){
            resolve(user);
        }else{
            reject(new Error("Save DB Error!"))
        }
    })
}

function sendEmail(user, callback){
    console.log(`email to ${user.email}`);
    return new Promise((resolve) => {
        resolve(user);
    });
}

function getResult(user){
    return new Promise((resolve, reject) => {
        resolve(`success register ${user.name}`);
    })
}

function registerByPromise(user){
    const result = saveDB(user)
            .then(sendEmail)
            .then(getResult);
    console.log(result);
    return result;
}

const myUser = {
    email: "jerry@test.com",
    password: "1234",
    name: "jerry"
};
allResult = Promise.all([saveDB(myUser), sendEmail(myUser), getResult(myUser)]);
allResult.then(console.log);