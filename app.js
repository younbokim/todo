const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const Todo = require("./models/todo");

// 내 로컬 호스트 서버에 있는 데이터베이스에 연결
mongoose.connect("mongodb://localhost/todo-demo", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
});


const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));


const app = express();
const router = express.Router();

// 메인 url 접속 확인
router.get("/", (req, res) => {
    res.send("Hi!");
}); 

// 할일 추가 관련 정보들을 모두 받아오는 API
router.get("/todos", async (req, res) => {
    const todos = await Todo. find().sort("-order").exec();

    res.send({todos});

});

// 할일 추가 API
// order를 추가하면 지정된 order 값에 1을 더해주는 api 생성
router.post("/todos", async ( req, res ) => {

    const { value } = req.body; // 외부로부터의 값 전달받기
    const maxOrderTodo = await Todo.findOne().sort("-order").exec();// 걍 오더는 오름차순, -order는 내림차순, exec() 통해서 프로미스 생성, find 계열 이후에는 조건문 쿼리에 해당
    let order = 1; // 기본값 설정
    
    if (maxOrderTodo) {
        order = maxOrderTodo.order + 1;
    }

    const todo = new Todo({value, order});
    await todo.save(); // 해당 값을 몽고DB로 보냄

    res.send({todo});

});

// 할일 수정 API(파라미터 활용)
// 파라미터 기준으로 데이터를 찾고, 해당 파라미터를 ID 값으로 교체, 
router.patch("/todos/:todoId", async (req, res) => {
    const { todoId } = req.params;
    const { order, value, done } = req.body;
    const todo = await Todo.findById(todoId).exec();

    if (order) {
        const targetTodo = await Todo.findOne({ order }).exec();
        if (targetTodo) {
        targetTodo.order = todo.order;
        await targetTodo.save();
    } 
    
    todo.order = order;
    } else if (value) {
        todo.value = value;
    } else if (done !== undefined) {
        todo.doneAt = done ? new Date() : null;
    }

    await todo.save();
    
    res.send({});
});

router.delete("/todos/:todoId", async (req, res) => {
    const { todoId } = req.params;

    const todo = await Todo.findById(todoId).exec();
    await todo.delete();

    res.send({});
});


app.use("/api", bodyParser.json(), router);
app.use(express.static("./assets"));

app.listen(8080, () => {
    console.log("서버가 켜졌어요!");
});
