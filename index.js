var express=require("express");
var bodyParser=require("body-parser");
var ejs=require("ejs");
var http=require("http");
var socketIO=require("socket.io");
var message=require("./utils/message");
var moment=require("moment");
var isRealString=require("./utils/validation");
var Users=require("./utils/users");
var app=express();

app.use(express.static(__dirname+'/public'));
app.set('view engine','ejs');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:true}));


const server=http.createServer(app);
const io=socketIO(server);
var user=new Users();

io.on("connection",function(socket){

  console.log("user connected to server");

  socket.on("join",function(params,callback){
    console.log(isRealString(params.name));
    if(!isRealString(params.name)|| !isRealString(params.room)){
        return callback("name and room name are required");
    }

    socket.join(params.room);
    user.removeUser(socket.id);
    user.addUser(socket.id,params.name,params.room);

    io.to(params.room).emit("updateUserList",user.getUserList(params.room));
    //io.to("").emit()
    //socket.broadcast.to("").emit()
    //socket.emit

    socket.emit("newMessage",message("admin","welcome, have a nice day"));

    //emits the event to everyone connected expect the
    //one due to whom event occured
    socket.broadcast.to(params.room).emit("newMessage",message("admin",`${params.name} has joined the room`));

    callback();
  });



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
    var u=user.removeUser(socket.id);
    if (u){
      io.to(u.room).emit("updateUserList",user.getUserList(u.room));
      io.to(u.room).emit("newMessage",message("admin",`${u.name} has left`));
    }
  });

});

var port=process.env.PORT || 3000;

server.listen(port,function(){
  console.log(`server started successfully on port number ${port}`);
});
