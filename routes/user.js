var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('user/index',{});
});

router.get('/login',(req,res)=>{
  res.render('user/login',{hdr:true})
})

router.post('/login',(req,res)=>{
  console.log(req.body)
  res.redirect('/')
})

router.get('/signup',(req,res)=>{
  res.render('user/signup',{hdr:true})
})

router.post('/signup',(req,res)=>{
  console.log(req.body)
  res.redirect('/')
})


module.exports = router;
