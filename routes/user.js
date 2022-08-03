
var express = require('express');
var router = express.Router();
//var productHelper=require('../helpers/product-helpers')
var userHelper=require('../helpers/user-helpers')

var productHelper=require('../helpers/product-helpers')

// CommonJS

const otp =123;
let mobno;
let loginErr;

/* GET home page. */

router.get('/', async function (req, res, next) {
cakes=await productHelper.getProductCake()
cakes=cakes.slice(0, 8);
    res.render('user/index',{cakes});

});



//signup codes
router.get('/signup',(req,res)=>{
  if(req.session.userloggedIn){
    res.redirect('/')
  }
  else{
    res.render('user/signup',{hdr:true,loginErr})
  }
})

///if already have an account with this number we need show that user can login
/////////////
///////

router.post('/mob-num-submission',(req,res)=>{
  console.log(req.body)
 req.session.tempUser=req.body.mobno
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
  console.log(data);
  userHelper.registerUser(req.body,mobno).then((response)=>{
    req.session.userloggedIn=true
    req.session.user=response
    res.redirect('/')
  })
 
})



//login codes

router.get('/login',(req,res)=>{
  if(req.session.userloggedIn){
  res.redirect('/profile')
  }
else{
  res.render('user/login',{hdr:true,loginErr})
}
  
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


  router.get('/logout',(req,res)=>{

    req.session.userloggedIn=false;
    req.session.user=null;
    res.json({logout:true})
  })
//login codes ends..............



//user profile--------------------------------------------
router.get('/profile',async (req,res)=>{
  user = req.session.user;
  console.log(user)
  res.render('user/profile-page',{user})
})

router.get('/edit-user-details',(req,res)=>{
  user = req.session.user;
  res.render('user/edit-address',{user})
})


router.post('/edit-user-details',(req,res)=>{
  
  userHelper.editUserDetails(req.body,req.session.user._id).then((user)=>{
    console.log(user);
    req.session.user=user;
    res.redirect('/profile')
  })
})


//cart routes
router.get('/cart',async (req,res)=>{
 
  user=req.session.user;
  userId=user._id;
  let products=null;
  let total=null
  if(user){
     products=await userHelper.getCartProducts(req.session.user._id);
     total=await userHelper.getTotalAmount(req.session.user._id)
  }
  res.render('user/cart',{products,userId,total})
})


router.get('/addtocart/:id',(req,res)=>{
  
  userHelper.addToCart(req.session.user._id,req.params.id).then(()=>{
    res.json(req.params.id)
  }
  )
})


router.post('/change-product-quantity',(req,res)=>{
  console.log(req.body)
  
  userHelper.changeProductQuantity(req.body).then(async(response)=>{
    console.log(response)
    
    if(req.body.quantity==1 && req.body.count==-1){
      response.total=0;
    }
    else{
    response.total=await userHelper.getTotalAmount(req.body.user)
    // if(response.total>1000){
    //   response.orgTotal=true
    //  response.allTotal=response.total
    // }
    // else{
    //  response.allTotal=response.total+40;
    // }
  }
   
    // console.log(response.allTotal)
    res.json(response)
  })
})


router.post('/remove-cart-products',(req,res,next)=>{
  
  console.log(req.body);
  userHelper.removeCartProducts(req.body).then((response)=>{
    res.json(response)
  })
})


router.get('/checkout',(req,res)=>{
  res.render('user/checkout')
})

router.post('/Validate-discount-coupon',(req,res)=>{
//  if(req.session.couponApplied){
// res.json({valid:false})
//  }
//  else{
  if(req.body.discountCode=="abc@123"){
    // req.session.couponApplied=true;
    total=req.body.total-100;
    res.json({valid:true,total})
  }else{
    res.json({valid:false})
  }
//  }



})











//product listing page
router.get('/products-page',async(req,res)=>{
  cakes=await productHelper.getProductCake()
  res.render('user/products-page',{cakes})
})

module.exports = router;
