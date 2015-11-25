var mongoose = require('mongoose');
var assignmentSchema = mongoose.Schema({
  title: String,
  code: String,
  description: String,
  date: String,
  user: String,
  submit: {type: Boolean, default: false}
});




module.exports = mongoose.model("assignments", assignmentSchema);