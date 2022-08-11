
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

const verifyLogin=(req,res,next)=>{
  if(req.session.userloggedIn){
      next()
  }else{
      res.redirect('/login')
  }
}




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
router.get('/profile',verifyLogin,async (req,res)=>{
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
router.get('/cart',verifyLogin, async (req,res,next)=>{

  user=req.session.user;
  userId=user._id;
  let products=null;
  let total;
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


router.get('/checkout',async(req,res)=>{
  useraddress= await userHelper.getUserAddress(req.session.user._id)
  dlcharge=40;
  //set from admin side 
  total=parseInt(req.query.fullTotal);
  Ttlamount=total+dlcharge;
  pincode=req.query.pincode;
  res.render('user/checkout',{useraddress,pincode,total,dlcharge,Ttlamount})
 
})

router.post('/checkout',async(req,res)=>{
  
  req.body.userId=req.session.user._id;
  user=req.session.user._id;
  usr=req.session.user;
  price=  parseInt(1600);
  let products=await userHelper.getCartProducts(user)
   userHelper.PlaceOrder(req.body,products,price).then((orderId)=>{
    if(req.body['payment-method']=='COD'){
      res.json({cod_success:true})
    }else{
      userHelper.generateRazorPay(orderId,price,usr).then((response)=>{
        
       res.json(response)
      })
    }

  })



})

router.post('/verify-payment',(req,res)=>{
  console.log(req.body)
  userHelper.verifyPayment(req.body).then(()=>{
   userHelper.changePaymentStatus(req.body['order[receipt]']).then(()=>{
     res.json({status:true})
   })
  }).catch((err)=>{
    res.json({status:false})
  })
})

router.get('/ordered-response',async (req,res)=>{
  let user=req.session.user
  let mode=req.query.id
  let cod;
  let online;
  userHelper.deleteuserCart(user._id)

  if(mode=='cod'){
    cod=true
  }
  else{
    online=true;
  }
  res.render('user/ordered-response',{user,cod,online})
})


router.post('/Validate-discount-coupon',(req,res)=>{

  //   userHelper.validateDiscoundCoupon(req.body.discountCode).then((res)=>{
  //     console.log(res);
  // if(res.coupon===true){
  //   total=req.body.total-100;
  //   res.json({valid:true,total})
  // }else{
  //   res.json({valid:false})
  // }
  //   })
    if(req.body.discountCode=="abc@123"){
      // req.session.couponApplied=true;
      total=req.body.total-100;
      res.json({valid:true,total})
    }else{
      res.json({valid:false})
    }
  //  }
  
  
  
  })
  


//bbuy now--------------------------------------------------------------
router.get('/buynow',async (req,res)=>{
  let product= await productHelper.getSingleProduct(req.query.id)
  // userHelper.addToCart(req.session.user._id,req.query.id).then(()=>{
   product.quantity=1;
    res.render('user/buynow',{product})
  // }
  // )
   
 
})

router.post('/tempCart',async (req,res)=>{
  console.log(req.body);
  req.session.tempCart=req.body;
  console.log(req.session.tempCart)
  res.json({success:true})
})














//product listing page
router.get('/products-page',async(req,res)=>{
  cakes=await productHelper.getProductCake()
  res.render('user/products-page',{cakes})
})

router.get('/product-detail-page', async(req,res)=>{
  let proId=req.query.id
  console.log('jjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjj');
console.log(proId);
    let product=await productHelper.getSingleProduct(proId)
   let cakes=await productHelper.getProductCake()
   
  res.render('user/product-detail-page',{product,cakes})
})



module.exports = router;
