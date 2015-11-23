var mongoose = require('mongoose');
var profileSchema = mongoose.Schema({
  username: String,
  gender: String,
  school: String,
  major: String
});




module.exports = mongoose.model("profiles", profileSchema);