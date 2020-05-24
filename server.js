var express = require("express"),
	http = require("http"),
	app = express(),
	mongoose = require("mongoose"),
	ToDosController = require("./controllers/todos_controller.js"),
		services, mongoUrl;
	
app.use(express.static(__dirname + "/client"));
// Это модель Mongoose для задач
http.createServer(app).listen(3000);
// командуем Express принять поступающие
// объекты JSON
app.use(express.urlencoded({ extended: true }));
// подключаемся к хранилищу данных Amazeriffic в Mongo
mongoose.connect('mongodb://localhost/amazeriffic', {
		useNewUrlParser: true,
		useCreateIndex: true,
		useUnifiedTopology: true 
	}).then(res => {
		console.log("DB Connected!")
	}).catch(err => {
		console.log(Error, err.message);
	});

app.get("/todos.json", ToDosController.index);
app.post("/todos", ToDosController.create);