var mongoose = require("mongoose"),
	ToDoSchema,
	ObjectId = mongoose.Schema.Types.ObjectId;
// Это модель mongoose для списка задач
ToDoSchema = mongoose.Schema({
	description: String,
	tags: [ String ],
	owner : { type: ObjectId, ref: "User" }
});
var ToDo = mongoose.model("ToDo", ToDoSchema);
module.exports = ToDo;