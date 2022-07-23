
var express = require('express');
var router = express.Router();
//var productHelper=require('../helpers/product-helpers')
var userHelper=require('../helpers/user-helpers')


const otp =123;
let mobno;
let loginErr;


/* GET home page. */
router.get('/', function(req, res, next) {
  if( req.session.userloggedIn){
    res.render('user/index',{});
  }
  else{
    res.redirect('/login')
  }

});



//signup codes
router.get('/signup',(req,res)=>{
  res.render('user/signup',{hdr:true,loginErr})
})

router.post('/mob-num-submission',(req,res)=>{
  console.log(req.body)
  mobno=req.body.mobnum
  
  loginErr=null;
  //otp send to mobile number

  res.json(otp)
})

router.post('/otp',(req,res)=>{
console.log(req.body)
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

router.post('/full-details-form',(req,res)=>{
  console.log(req.body)
  var data=req.body
  data.mobnum=mobno;
  delete data.psw2;
  console.log("hiiiiiiiiiiiiii")
  console.log(data);
  userHelper.registerUser(req.body,mobno).then((response)=>{
    req.session.userloggedIn=true
    req.session.user=response
    res.redirect('/')
  })
 
})



//login codes

router.get('/login',(req,res)=>{
  res.render('user/login',{hdr:true,loginErr})
})


router.post('/login-mob-num-submission',(req,res)=>{
  console.log(req.body)
  mobno=req.body.mobnum
  userHelper.findUserByMobNum(mobno).then((response)=>{
  console.log(response)
  loginErr=null;
  //otp send to mobile number
req.session.tempUser=response;
  res.json(response)
  })
  
})

router.post('/login-otp',(req,res)=>{
  console.log(req.body)
  //checking otp;
  if(req.body.otp==otp){
    loginErr=null;
    req.session.user=req.session.tempUser;
    req.session.userloggedIn=true;
    console.log(req.session.user)
    req.session.tempUser=null;
    res.redirect('/')
  }
  else{
    
     loginErr="Wrong Otp.Please retry"
    res.redirect('/login')
  }
  })


//login codes ends..............



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




module.exports = router;
