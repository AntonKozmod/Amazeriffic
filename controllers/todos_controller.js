var ToDo = require("../models/todo.js"),
	ToDosController = {};

ToDosController.index = function (req, res) {
	ToDo.find({}, function(err, toDos) {
		res.json(toDos);
	});
}

ToDosController.show = function (req, res) {
	// это ID, который мы отправляем через URL
	var id = req.params.id;
	// находим элемент списка задач с соответствующим ID
	ToDo.find({"_id":id}, function (err, todo) {
		if (err !== null) {
			// res.json(err);
			// возвращаем внутреннюю серверную ошибку
			res.status(500).json(err);
		} else {
			if (todo.length > 0) {
				// res.json(todo[0]);
				// возвращаем успех
				res.status(200).json(todo[0]);
			} else {
				// res.send("Не найдено");
				// мы не нашли элемент списка задач с этим ID!
				res.send(404);
			}
		}

	});
}

ToDosController.create = function (req, res) {
	var newToDo = new ToDo({"description": req.body.description,
							"tags": req.body.tags});
	newToDo.save(function (err, result) {
		console.log(result);
		if (err !== null) {
			// элемент не был сохранен!
			console.log(err);
			res.json(500, err);
		} else {
			res.json(200,result);
		}
	});
}

module.exports = ToDosController;
