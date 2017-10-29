function isRealString(str){
  //console.log(str.trim());
  return (typeof str == 'string' && str.trim().length>0);
}

module.exports=isRealString;
