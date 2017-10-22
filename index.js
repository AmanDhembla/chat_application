var express=require("express");
var bodyParser=require("body-parser");
var ejs=require("ejs");
var _=require("lodash");
var http=require("http");

var app=express();

var userRouter=require("./routes/user");

app.use("/",userRouter);



app.use(express.static('public'));
app.set('view engine','ejs');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:true}));

app.listen(3000,function(){
  console.log("server started successfully");
});
