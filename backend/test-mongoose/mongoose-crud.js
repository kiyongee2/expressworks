const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const People = require("./people-model")

mongoose.set("strictQuery", false);

const app = express();
app.use(bodyParser.json());

app.listen(3000, async () => {
    console.log("Server started");
    const mongodbUri = 'mongodb+srv://admin:1234@cluster0.wqr7ol1.mongodb.net/myboard?retryWrites=true&w=majority&appName=Cluster0';

    mongoose
        .connect(mongodbUri, { useNewUrlParser: true })
        .then(console.log("Connected to MongoDB"));
});

// 모든 people 데이터 출력
app.get("/people", async (req, res) => {
    const people = await People.find({});
    res.send(people);
})

// people 데이터 추가
app.post("/people", async (req, res) => {
    const people = new People(req.body);
    await people.save();
    res.send(people);
})

// 특정 이메일로 people 찾기
app.get("/people/:email", async (req, res) => {
    const people = await People.findOne({ email: req.params.email });
    res.send(people);
});

// people 데이터 수정
app.put("/people/:email", async (req, res) => {
    const people = await People.findOneAndUpdate(
        { email: req.params.email },
        { $set: req.body },
        { new: true }
    );
    console.log(people);
    res.send(people);
});

// people 데이터 삭제
app.delete("/people/:email", async (req, res) => {
    await People.deleteMany({ email: req.params.email });
    res.send({ success: true })
})