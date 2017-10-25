var moment=require("moment");
var message=function(From, Text){
  return {
    from: From,
    text: Text,
    createdAt: moment().valueOf()
  }
}
module.exports=message;
