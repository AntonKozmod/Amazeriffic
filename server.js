var express = require("express"),
	http = require("http"),
	app = express(),
	mongoose = require("mongoose"),
	ToDo = require("./models/todo.js");	
	
app.use(express.static(__dirname + "/client"));
// Это модель Mongoose для задач
http.createServer(app).listen(3000);
// Этот маршрут замещает наш файл
// todos.json в примере из части 5
app.get("/todos.json", function (req, res) {
	ToDo.find({}, function (err, toDos) {
		// не забудьте о проверке на ошибки
		res.json(toDos);
	});
});
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
app.post("/todos", function (req, res) {
	console.log(req.body);
	var newToDo = new ToDo({"description":req.body.description,
		"tags":req.body.tags});
	newToDo.save(function (err, result) {
		if (err !== null) {
			console.log(err);
			res.send("ERROR");
		} else {
			// клиент ожидает, что будут возвращены все задачи,
			// поэтому для сохранения совместимости сделаем дополнительный запрос
			ToDo.find({}, function (err, result) {
				if (err !== null) {
					// элемент не был сохранен
					res.send("ERROR");
				}
				res.json(result);
			});
		}
	});
});
