
var express = require('express');
var router = express.Router();

const otp =123;
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
  
  res.render('user/registration-form',{hdr:true})
}
else{
   loginErr="Wrong Otp.Please retry"
  res.redirect('/login')
}
})


router.get('/profile',(req,res)=>{
  console.log(req.body)
  res.render('user/profile-page',{hdr:true})
})

router.get('/myorders',(req,res)=>{
  res.render('user/myorders',{hdr:true})
})
router.get('/manage-address',(req,res)=>{
  res.render('user/manage-address',{hdr:true})
})
router.get('/wishlist',(req,res)=>{
  res.render('user/wishlist',{hdr:true})
})

router.post('/full-details-form',(req,res)=>{
  console.log(req.body)
  res.redirect('/')
})




module.exports = router;
