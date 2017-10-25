var express=require("express");
var bodyParser=require("body-parser");
var ejs=require("ejs");
var http=require("http");
var socketIO=require("socket.io");
var message=require("./utils/message");

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
  socket.broadcast.emit("newMessage",{
    from:"admin",
    text:"a new user joined the room"
  });

  socket.on("createMessage",function(data){
    console.log("new message recieved",data);
    //io.emit emits the data to every connection whereas socket.emit
    // emits to particular socket connection
    io.emit("newMessage",{
      from:data.from,
      text:data.text
    });
  });

  socket.on("createLocationMessage",function(data){
    io.emit("newLocationMessage",{
      from:data.from,
      url:`https://www.google.com/maps?q=${data.latitude},${data.longitude}`,
      createdAt:new Date().getTime()
    });
  });

  socket.on("disconnect",function(){
    console.log("user disconnected");
  });

});

var port=process.env.PORT || 3000;

server.listen(port,function(){
  console.log(`server started successfully on port number ${port}`);
});
