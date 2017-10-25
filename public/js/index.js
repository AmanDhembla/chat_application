var socket= io();
console.log(socket);
socket.on("connect",()=>{
  console.log("server connected to client");

});

socket.on("newMessage",function(data){

  var formattedTime=moment(data.createdAt).format("h:mm a");
  var template=jQuery("#message-template").html();
  console.log(template);
  var html=Mustache.render(template,{
    text:data.text,
    from:data.from,
    createdAt:formattedTime
  });

  $("#message").append(html);
})

socket.on("disconnect",()=>{
  console.log("server disconnected from client");
});


jQuery("#message-form").on("submit",function(e){
  e.preventDefault();

  socket.emit("createMessage",{
    from:"User",
    text:jQuery("[name=message]").val()
  },function(){
    jQuery("[name=message]").val('');
  });
});


var localButton=jQuery("#send-location");
localButton.on("click",function(e){
    if(navigator.geolocation){
      localButton.attr("disabled","disabled").text("sending location...");
      navigator.geolocation.getCurrentPosition(function(position){
        console.log(position);
        socket.emit("createLocationMessage",{
          from:"user",
          latitude:position.coords.latitude,
          longitude:position.coords.longitude
        },function(){
          localButton.removeAttr("disabled").text("send location");
        });
      },function(){
        localButton.removeAttr("disabled").text("send location");
        alert("unable to fetch the co-ordinates");
      });
    }else{
      alert("your browser doesn't support the location feature")
    }
});


socket.on("newLocationMessage",function(data){

  var formattedTime=moment(data.createdAt).format("h:mm a");
  var template=jQuery("#location-message-template").html();
  var html=Mustache.render(template,{
    url:data.url,
    from:data.from,
    createdAt:formattedTime
  });

  $("#message").append(html);
});
