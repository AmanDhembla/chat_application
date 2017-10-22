var mongoose=require("mongoose");
var Schema=mongoose.Schema;
const passportLocalMongoose = require('passport-local-mongoose');

var userSchema=new Schema({
  username:String,
  email:String,
  password:String
});

User.plugin(passportLocalMongoose);
module.exports=mongoose.model("User",userSchema);
