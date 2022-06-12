
var express = require('express');
var router = express.Router();


/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('user/index',{});
});

router.get('/login',(req,res)=>{
  res.render('user/login',{hdr:true})
})

router.post('/mob-num-submission',(req,res)=>{
  console.log(req.body)
  var otp=43567;
 
  res.json(otp)
})









router.get('/number-submit',(req,res)=>{
  res.render('user/registration-form',{hdr:true})
})

router.get('/signup',(req,res)=>{
  console.log(req.body)
  res.render('user/signup',{hdr:true})
})

router.get('/signup-password-submit',(req,res)=>{
  res.render('user/index',{})
})

router.post('/signup',(req,res)=>{
  console.log(req.body)
  res.redirect('/')
})


module.exports = router;
