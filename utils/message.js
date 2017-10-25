var message=function(From, Text){
  return {
    from: From,
    text: Text,
    createdAt: new Date().getTime()
  }
}
module.exports=message;
