var main = function (UsersObjects) {
	"use strict";
	var $input = $("<input>").addClass("username"),
		$butRegister = $("<button>").text("Зарегистрироваться"),
		$butLogin = $("<button>").text("Войти");
	$butRegister.on("click", function() {
		var username = $input.val();
		if (username !== "") {
			var newUser = {"username": username};
			$.post("users", newUser, function(result) {
				console.log(result);
				// отправляем на клиент
				UsersObjects.push(newUser);
			}).done(function(responde) {
				console.log(responde);
				alert('Аккаунт успешно создан!\nНажмите "Войти", чтобы продолжить')
			}).fail(function(jqXHR, textStatus, error) {
				console.log(error);
				if (jqXHR.status === 501) {
					alert("Такой пользователь уже существует!\nИзмените логин и повторите "
						+ "попытку");
				} else {					
					alert("Произошла ошибка!\n"+jqXHR.status + " " + jqXHR.textStatus);	
				}
			});
		}
	});
	$butLogin.on("click", function() {
		var username = $input.val();
		if (username !== "") {
			var loginUser = {"username": username};
			$.ajax({
				'url': '/users/'+username,
				'type': 'GET'
			}).done(function(responde) {
				window.location.replace('users/' + username + '/');
			}).fail(function(jqXHR, textStatus, error) {
				console.log(error);
				alert("Произошла ошибка!\n"+jqXHR.status + " " + jqXHR.textStatus);	
			});
		}
	})
	$("main .container").append($input);
	$("main .container").append($butRegister);
	$("main .container").append($butLogin);
}

$(document).ready(function() {
	$.getJSON("users.json", function (UsersObjects) {
		main(UsersObjects);
	});
});