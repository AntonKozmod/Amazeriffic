var mongoose = require('mongoose'),
    User = require('../models/user.js'),
    ToDo = require("../models/todo.js");

var UsersController = {};

UsersController.index = function(req, res) {
  console.log('Вызвано действие: UsersController.index');
  User.find(function (err, users) {
  		if (err !== null) {
			res.json(500, err);
  		} else {
  			res.status(200).json(users);
  		}
  });
};

// Отобразить пользователя
UsersController.show = function(req, res) {
  console.log('Вызвано действие: отобразить пользователя');
  User.find({'username': req.params.username}, function(err, result) {
    if (err) {
      console.log(err);
    } else if (result.length !== 0) {
      /*ToDo.find({"owner": result[0]._id}, function(err, toDos) {
      	if (err !== null) {
      		res.json(500, err);
      	} else {
      		document.location.href = "/users/"+username;
      		res.status(200).json(toDos);
      	}
      });*/
      	res.sendfile('./client/list.html');
    } else {
      res.send(404);
    }
  });
};

// Создать нового пользователя
UsersController.create = function(req, res) {
  console.log('Вызвано действие: создать пользователя');
    var username = req.body.username; 
    // console.log(username);
    User.find({"username": username}, function (err, result) {
        if (err) {
            console.log(err);
            res.send(500, err);
        } else if (result.length !== 0) {
            res.status(501).send("Пользователь уже существует");
            console.log(err);   
            console.log("Пользователь уже существует"); 
        } else {
            var newUser = new User({
                "username": username
            });
            newUser.save(function(err, result) {
                console.log(err); 
                if (err !== null) {
                    res.json(500, err); 
                } else {
                    res.json(200, result);
                    console.log(result); 
                }
            });
        }
    }); 
};

// Обновить существующего пользователя
UsersController.update = function (req, res) {
	console.log("Вызвано действие: обновить пользователя");
	var id = req.params.username;
	var newUsername = {$set: {username: req.body.username}};
	User.updateOne({"username": username}, newUsername, function (err,user) {
		if (err !== null) {
			res.status(500).json(err);
		} else {
			if (user.n === 1 && user.nModified === 1 && user.ok === 1) {
				res.status(200).json(todo).json({"status": 404});
			} else {
				res.status(404);
			}
		}
	});
};
// Удалить существующего пользователя
UsersController.destroy = function (req, res) {
	console.log("Вызвано действие: удалить пользователя");
	var username = req.params.username;
	ToDo.deleteOne({"username": username}, function (err, user) {
		if (err !== null) {
			res.status(500).json(err);
		} else {
			if (user.n === 1 && user.ok === 1 && user.deletedCount === 1) {
				res.status(200).json(todo);
			} else {
				res.status(404).json({"status": 404});
			}
		}
	});
};

module.exports = UsersController;