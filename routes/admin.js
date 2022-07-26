var express = require('express');
var router = express.Router();
const adminHelpers=require('../helpers/admin-helpers')
const productHelpers=require('../helpers/product-helpers')


const verifyLogin=(req,res,next)=>{
  if(req.session.adminLoggedIn){
      next()
  }else{
      res.redirect('/admin/login')
  }
}


/* GET users listing. */
router.get('/',function(req, res, next) {

if(req.session.adminLoggedIn){
  res.render('admin/index',{admin:true}); 
}
else{
  res.redirect('admin/login')
}
 
});


//admin login--------------------------------------

router.get('/login', (req,res)=>{
if(!req.session.adminLoggedIn){
  res.render('admin/login',{admin:true,"loginErr":req.session.adminloginErr})
  req.session.userloginErr=null;
  
}
else{
  res.redirect('/admin')
}
})



router.post('/login',(req,res)=>{
console.log(req.body)
adminHelpers.doLogin(req.body).then((response)=>{

      if(response.status){
          req.session.admin=response.admin
          console.log(response.admin);
          req.session.adminLoggedIn=true
          res.redirect('/admin')
      }else{
          req.session.adminloginErr=response.error
          res.redirect('/admin/login')
      }
  })
})

router.get('/product-add',(req,res)=>{
  res.render('admin/products-add',{admin:true})
})

router.post('/products-add',(req,res)=>{
  console.log(req.body)
  console.log(req.files.Image1)
  
  productHelpers.addProduct(req.body,(id)=>{
    let image=req.files.Image1
    image.mv('./public/product-images/'+id+'1'+'.jpg',(err,done)=>{
      if(err){
        console.log(err)
      }
      
    })
  
    image=req.files.Image2
    image.mv('./public/product-images/'+id+'2'+'.jpg',(err,done)=>{
      if(err){ 
        console.log(err)
      }    
    })
    image=req.files.Image3
    image.mv('./public/product-images/'+id+'3'+'.jpg',(err,done)=>{
      if(!err){
        console.log("iiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiii");
        res.redirect('/admin/product-add')
      }else{
        console.log(err)
      } 
    })
  })





 

  

})


router.get('/edit-products',(req,res)=>{
  res.render('admin/edit-products',{admin:true})
})

router.get('/view-all-cakes',(req,res)=>{
  res.render('admin/view-all-products')
})




module.exports = router;
