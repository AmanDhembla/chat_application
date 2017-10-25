var express=require("express");
var bodyParser=require("body-parser");
var ejs=require("ejs");
var http=require("http");
var socketIO=require("socket.io");
var message=require("./utils/message");
var moment=require("moment");
var app=express();

app.use(express.static(__dirname+'/public'));
app.set('view engine','ejs');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:true}));


const server=http.createServer(app);
const io=socketIO(server);

io.on("connection",function(socket){
  console.log("user connected to server");

  socket.emit("newMessage",message("admin","welcome, have a nice day"));

  //emits the event to everyone connected expect the
  //one due to whom event occured
  socket.broadcast.emit("newMessage",message("admin","a new user joined the room"));

  socket.on("createMessage",function(data,callback){
    console.log("new message recieved",data);
    //io.emit emits the data to every connection whereas socket.emit
    // emits to particular socket connection
    io.emit("newMessage",message(data.from,data.text));
    callback();
  });

  socket.on("createLocationMessage",function(data,callback){
    io.emit("newLocationMessage",{
      from:data.from,
      url:`https://www.google.com/maps?q=${data.latitude},${data.longitude}`,
      createdAt:moment.valueOf()
    });
    callback();
  });

  socket.on("disconnect",function(){
    console.log("user disconnected");
  });

});

var port=process.env.PORT || 3000;

server.listen(port,function(){
  console.log(`server started successfully on port number ${port}`);
});
