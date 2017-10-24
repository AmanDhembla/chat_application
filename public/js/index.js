var socket= io();
console.log(socket);
socket.on("connect",()=>{
  console.log("server connected to client");

});

socket.on("newMessage",function(data){
  console.log(data);
})

socket.on("disconnect",()=>{
  console.log("server disconnected from client");
});
