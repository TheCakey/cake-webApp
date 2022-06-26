var express = require('express');
var router = express.Router();

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.render('admin/index-admin',{admin:true})
});


router.get('/site-management',(req,res)=> {
  res.render('admin/site-management/admin-page',{admin:true})
})
router.get('/order-management',(req,res)=> {
  res.render('admin/order-management/admin-page',{admin:true})
})

router.get('/site-management-settings',(req,res)=>{
  res.render('admin/site-management/settings',{admin:true})
})

router.get('/site-management-orders',(req,res)=>{
  res.render('admin/site-management/orders',{admin:true})
})

router.get('/site-management-signup',(req,res)=>{
  res.render('admin/site-management/signup',{admin:true})
})

router.get('/site-management-login',(req,res)=>{
  res.render('admin/site-management/login',{admin:true})
})



module.exports = router;
