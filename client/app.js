var organizeByTags = function (toDoObjects) { 
	// создание пустого массива для тегов
	var tags = [];
	// перебираем все задачи toDos 
	toDoObjects.forEach(function (toDo) {
		// перебираем все теги для каждой задачи 
		toDo.tags.forEach(function (tag) {
			// убеждаемся, что этого тега еще нет в массиве
			if (tags.indexOf(tag) === -1) { 
				tags.push(tag);
			}
		});
	}); 
	var tagObjects = tags.map(function (tag) {
		// здесь мы находим все задачи,
		// содержащие этот тег
		var toDosWithTag = []; 
		toDoObjects.forEach(function (toDo) {
			// проверка, что результат
			// indexOf is *не* равен -1
			if (toDo.tags.indexOf(tag) !== -1) { 
				toDosWithTag.push(toDo.description);
			}
		});
		// мы связываем каждый тег с объектом, который содержит название тега и массив
		return { "name": tag, "toDos": toDosWithTag };
	});
	return tagObjects;
};

var liaWithDeleteOnClick = function(todo) {
	var $todoListItem = $("<li>").text(todo.description),
		$todoRemoveLink = $("<a>").attr("href", "todos/" + todo._id);
	$todoRemoveLink.text("Удалить");
	console.log("todo._id: " + todo._id);
	console.log("todo.description: " + todo.description);
	$todoRemoveLink.on("click", function () {
		$.ajax({
			"url": "todos/" + todo._id,
			"type": "DELETE"
		}).done(function (responde) {
			$(".tabs a:first-child span").trigger("click");
		}).fail(function (err) {
			console.log("error on delete 'todo'!");
		});
		return false;
	});
	$todoListItem.append($todoRemoveLink);
	return $todoListItem;
}

var main = function (toDoObjects) {
	"use strict";
	// добавляем вкладку Новые
	tabs.push({
		"name": "Новые",
		// создаем функцию content
		// так, что она принимает обратный вызов
		"content": function(callback) {
			$.getJSON("todos.json", function (toDoObjects) {
				var $content,
					i;
				$content = $("<ul>");
				for (i = toDoObjects.length-1; i>=0; i--) {
					var $todoListItem = liaWithDeleteOnClick(toDoObjects[i]);
					$content.append($todoListItem);
				}
				callback(null, $content);
			}).fail(function (jqXHR, textStatus, error) {
				callback(error, null);
			});
		}
	});

	// добавляем вкладку Старые
	tabs.push({
		"name": "Старые",
		"content": function(callback) {
			$.get("todos.json", function (toDoObjects) {
				// создание $content для Старые
				// генерация и отображение содержимого вкладки Новые
				var $content = $("<ul>");
				toDos = toDoObjects.map(function (toDo) {
					return toDo.description;
				});
				toDos.forEach(function(todo) {
					$content.append($("<li>").text(todo));
				});
				callback(null,$content);
			}).fail(function (jqXHR, textStatus, error) {
				callback(error, null);
			});
		}
	});

	// добавляем вкладку Теги
	tabs.push({
		"name": "Теги",
		"content":function (callback) {
			$.get("todos.json", function (toDoObjects) {	
				// создание $content для Теги 
				var organizedByTag = organizeByTags(toDoObjects),
					$content;
				organizedByTag.forEach(function (tag) {
					var $tagName = $("<h3>").text(tag.name);
						$content = $("<ul>");
					tag.toDos.forEach(function (description) {
						var $li = $("<li>").text(description);
						$content.append($li);
					});
					$("main .content").append($tagName);
					$("main .content").append($content);
				});
				callback(null,$content);
			}).fail(function (jqXHR, textStatus, error) {
				// в этом случае мы отправляем ошибку вместе с null для $content
				callback(error, null);
			});
		}
	});

	// создаем вкладку Добавить
	tabs.push({
		"name": "Добавить",
		"content":function () {
			$.get("todos.json", function (toDoObjects) {	
				// создание $content для Добавить 
				var $input = $("<input>").addClass("description"), 
					$textInput = $("<p>").text("Введите новую задачу: "),
					$tagInput = $("<input>").addClass("tags"),
					$tagLabel = $("<p>").text("Тэги: "),
					$button = $("<button>").text("+");
				$("main .content").append($textInput).append($input).append($tagLabel).append($tagInput).append($button); 
				function btnfunc() {
					var description = $input.val(),
						tags = $tagInput.val().split(","),
						// создаем новый элемент списка задач
						newToDo = {"description":description, "tags":tags};
					$.post("todos", newToDo, function(result) {
						$input.val("");
						$tagInput.val("");
						$(".tabs a:first-child span").trigger("click");
					});
				}
				$button.on("click", function() {
					btnfunc();
				});
				$('.tags').on('keydown',function(e){
					if (e.which === 13) {
						btnfunc();
					}
				});
			});
		}
	});

	tabs.forEach(function (tab) {
		var $aElement = $("<a>").attr("href",""),
			$spanElement = $("<span>").text(tab.name);
		$aElement.append($spanElement);
		$("main .tabs").append($aElement);

		$spanElement.on("click", function () {
			var $content;
			$(".tabs a span").removeClass("active");
			$spanElement.addClass("active");
			$("main .content").empty();
			tab.content(function (err, $content) {
				if (err !== null) {
					alert ("Возникла проблема при обработке запроса: " + err);
				} else {
					$("main .content").append($content);
				}
			});
			return false;
		});
	});

	$(".tabs a:first-child span").trigger("click");
}

$(document).ready(function() {
	$.getJSON("todos.json", function (toDoObjects) {
		main(toDoObjects);
	});
});

/*	OLD VERSION
var main = function (toDoObjects) {
	"use strict";
	var toDos = toDoObjects.map(function (toDo) {
		// просто возвращаем описание
		// этой задачи
		return toDo.description;
	});
	
	$(".tabs a span").toArray().forEach(function (element) {
		// создаем обработчик щелчков для этого элемента
		$(element).on("click", function() {
			// поскольку мы используем версию элемента jQuery,
			// нужно создать временную переменную, 
			// чтобы избежать постоянного обновления
			var $element = $(element);
			$(".tabs a span").removeClass("active");
			$element.addClass("active");
			$("main .content").empty();
			if ($element.parent().is(":nth-child(1)")) {
				for (var i = toDos.length-1; i > -1; i--) {
					$(".content").append($("<li>").text(toDos[i]));
				}
			} else if ($element.parent().is(":nth-child(2)")) {
				toDos.forEach(function (todo) {
					$(".content").append($("<li>").text(todo));
				});
			} else if ($element.parent().is(":nth-child(3)")) {
				// ЭТО КОД ДЛЯ ВКЛАДКИ ТЕГИ
				var organizedByTag = organizeByTags(toDoObjects);
				organizedByTag.forEach(function (tag) {
					var $tagName = $("<h3>").text(tag.name),
					$content = $("<ul>");
					tag.toDos.forEach(function (description) {
						var $li = $("<li>").text(description);
						$content.append($li);
					});
					$("main .content").append($tagName);
					$("main .content").append($content);
				});
			} else if ($element.parent().is(":nth-child(4)")) {
				var $input = $("<input>").addClass("description"), 
				$textInput = $("<p>").text("Введите новую задачу: "),
				$tagInput = $("<input>").addClass("tags"),
				$tagLabel = $("<p>").text("Тэги: "),
				$button = $("<button>").text("+");
				$("main .content").append($textInput).append($input).append($tagLabel).append($tagInput).append($button); 
				function btnfunc() {
					var description = $input.val(),
						tags = $tagInput.val().split(","),
						// создаем новый элемент списка задач
						newToDo = {"description":description, "tags":tags};
					$.post("todos", newToDo, function(result) {
						console.log(result);
						// нужно отправить новый объект на клиент
						// после получения ответа сервера
						toDoObjects.push(newToDo);
						// обновляем toDos
						toDos = toDoObjects.map(function (toDo) {
							return toDo.description;
						});
						$input.val("");
						$tagInput.val("");
						$(".tabs a:first-child span").trigger("click");
					});
				}
				$button.on("click", function() {
					btnfunc();
				});
				$('.tags').on('keydown',function(e){
					if (e.which === 13) {
						btnfunc();
					}
				});
			}
			return false;
		});
	});
	$(".tabs a:first-child span").trigger("click");
};
*/
