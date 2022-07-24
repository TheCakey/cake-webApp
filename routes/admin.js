var express = require('express');
var router = express.Router();
const adminHelpers=require('../helpers/admin-helpers')





// const verifyLogin=(req,res,next)=>{
//   if(req.session.adminLoggedIn){
//       next()
//   }else{
//       res.redirect('/admin/login')
//   }
// }


/* GET users listing. */
router.get('/', function(req, res, next) {

  res.render('admin/index',{admin:true}); 
});


router.get('/login',(req,res)=>{

res.render('admin/login',{admin:true})

})

router.post('/login',(req,res)=>{
  console.log('qqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqq')
console.log(req.body)
console.log('qqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqq')

adminHelpers.doLogin(req.body).then((response)=>{
      if(response.status){
         
          res.redirect('/admin')
      }else{
        
          res.redirect('/admin/login')
      }
  })
})




// router.get('/login',(req,res)=>{
// if(req.session.userLoggedIn){
//   res.redirect('/admin')
// }
// else{
// res.render('admin/login',{admin:true,"loginErr":req.session.adminloginErr})
// req.session.userloginErr=null;
// }
// })

// router.post('/login',(req,res)=>{
// console.log(req.body)
// adminHelpers.doLogin(req.body).then((response)=>{
//       if(response.status){
//           req.session.user=response.user
//           req.session.adminLoggedIn=true
//           res.redirect('/admin')
//       }else{
//           req.session.adminloginErr=response.error
//           res.redirect('/admin/login')
//       }
//   })
// })

module.exports = router;
