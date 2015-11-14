var mongoose = require('mongoose');
var assignmentSchema = mongoose.Schema({
  title: String,
  code: String,
  description: String,
  date: String,
  user: String
});




module.exports = mongoose.model("assignments", assignmentSchema);