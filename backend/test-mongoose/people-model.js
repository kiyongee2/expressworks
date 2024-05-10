// 몽구스로 스키마 만들기
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

const peopleSchema = new Schema({
    name: String,
    age: Number,
    email: { type: String, required: true }
})

module.exports = mongoose.model("People", peopleSchema);