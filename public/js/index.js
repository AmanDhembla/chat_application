var socket= io();
console.log(socket);
socket.on("connect",()=>{
  console.log("server connected to client");

});

socket.on("newMessage",function(data){
  var li=jQuery("<li></li>");
  li.text(`${data.from}:${data.text}`);
  $("#message").append(li);
  console.log(data);
})

socket.on("disconnect",()=>{
  console.log("server disconnected from client");
});


jQuery("#message-form").on("submit",function(e){
  e.preventDefault();

  socket.emit("createMessage",{
    from:"User",
    text:jQuery("[name=message]").val()
  });
})
