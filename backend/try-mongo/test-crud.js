
// mongodb 연결
//const { MongoClient } = require('mongodb');
const MongoClient = require('mongodb').MongoClient;
const url = 'mongodb+srv://admin:1234@cluster0.wqr7ol1.mongodb.net/myboard?retryWrites=true&w=majority&appName=Cluster0';

const client = new MongoClient(url, { useNewUrlParser: true });

async function main(){
    try{
        await client.connect();
        console.log("MongoDB 접속 성공!");

        // db 및 collection 생성
        const collection = client.db('myboard').collection('person');

        // 문서 추가
        await collection.insertOne({name: 'jerry', age: 30});

        // 문서 변경
        await collection.updateOne({ name: 'jerry'}, { $set: { age: 40 }});
        console.log("문서 업데이트");

        // 문서 찾기
        const documents = await collection.find({ name: 'jerry' }).toArray();
        console.log(documents);

        // 연결 끊기
        await client.close();

    } catch(err){
        console.error(err);
    }
}

main();
