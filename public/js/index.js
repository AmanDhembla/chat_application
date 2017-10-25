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
});


var localButton=jQuery("#send-location");
localButton.on("click",function(e){
    if(navigator.geolocation){
    navigator.geolocation.getCurrentPosition(function(position){
      console.log(position);
      socket.emit("createLocationMessage",{
        from:"user",
        latitude:position.coords.latitude,
        longitude:position.coords.longitude
      });
    },function(){
      alert("unable to fetch the co-ordinates");
    });
  }else{
    alert("your browser doesn't support the location feature")
  }
});


socket.on("newLocationMessage",function(data){
  var li=jQuery("<li></li>");
  var a=jQuery("<a target='_blank'>my current location</a>");

  li.text(`${data.from}:`);
  a.attr("href",data.url);
  li.append(a);
  $("#message").append(li);
});
