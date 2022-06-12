
var express = require('express');
var router = express.Router();

const otp =43567;
let loginErr;
/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('user/index',{});
});

router.get('/login',(req,res)=>{
  
  res.render('user/login',{hdr:true,loginErr})
})

router.post('/mob-num-submission',(req,res)=>{
  console.log(req.body)
  loginErr=null;
  //otp send to mobile number 
 
  res.json(otp)
})





router.post('/otp',(req,res)=>{

//checking otp;
if(req.body.otp==otp){
  loginErr=null;
  res.redirect("/")
}
else{
   loginErr="Wrong Otp.Please retry"
  res.redirect('/login')
}
 
})


router.get('/signup',(req,res)=>{
  res.render('user/signup',{hdr:true})
})





module.exports = router;
