const mongoose = require("mongoose");

const TodoSchema = new mongoose.Schema({
    value: String,
    doneAt: Date,
    order: Number
});

// 프론트 상에 todoid 값이 있어야 돌아감
// 몽고DB는 _id 항목에 고유 값들을 가지고 있음
// virtual 메서드를 통해서 스키마를 추가하는 것이 가능함
// to do id 라는 열을 추가하고, 콜백 함수 값을 받아서 데이터를 추가(this는 객체 자체, _id를 Hexstring 형태로 변환)
TodoSchema.virtual("todoId").get(function () { 
    return this._id.toHexString();
});

// 데이터베이스 타입을 JSON으로 변경, virtual schema 형태로 자료 구조를 세팅
TodoSchema.set("toJSON", {
    virtuals: true,
});
module.exports = mongoose.model("Todo", TodoSchema);

