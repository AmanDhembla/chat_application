var express=require("express");
var bodyParser=require("body-parser");
var ejs=require("ejs");
var http=require("http");
var socketIO=require("socket.io");

var app=express();

app.use(express.static(__dirname+'/public'));
app.set('view engine','ejs');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:true}));

const port=process.env.PORT || 3000;
const server=http.createServer(app);
const io=socketIO(server);

io.on("connection",function(socket){
  console.log("user connected to server");

  socket.on("createMessage",function(data){
    console.log("new message recieved",data);
    io.emit("newMessage",{
      from:data.from,
      text:data.text
    });
  });



  socket.on("disconnect",function(){
    console.log("user disconnected");
  });

});



server.listen(port,function(){
  console.log(`server started successfully on port number ${port}`);
});
