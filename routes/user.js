var router=require("express-promise-router")();

router.get("/",function(req,res,next){
  return res.render("index",{text:"this is a basic test"});
});


module.exports=router;
