
var express = require('express');
var router = express.Router();
//var productHelper=require('../helpers/product-helpers')
var userHelper=require('../helpers/user-helpers')

var productHelper=require('../helpers/product-helpers');
const adminHelpers = require('../helpers/admin-helpers');

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

router.post('/mob-num-submission',async (req,res)=>{
  console.log(req.body)
 req.session.tempUser=req.body.mobnum
  loginErr=null;
  mobnum=await userHelper.findUserByMobNum(req.body.mobnum);
  if(mobnum){
    res.json(false)
  }else{
//otp send to mobile number
res.json(true)
  }
  
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
  data.mobnum=req.session.tempUser;
  data.status=true;
  req.session.tempUser=null;
  delete data.psw2;
  console.log(data);
  userHelper.registerUser(data).then((response)=>{
    req.session.userloggedIn=true;
    req.session.user=response;
    if(req.session.tempProdId){
      prodId=req.session.tempProdId;
      req.session.tempProdId=null;
       res.redirect('/product-detail-page?id='+prodId)
    }else{
      res.redirect('/')
    }
  })
 
})



//login codes

router.get('/login',(req,res)=>{
  if(req.session.userloggedIn){
  res.redirect('/profile')
  }
else{
  if(req.query.id){
    req.session.tempProdId=req.query.id;
  }
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

    if(req.session.tempProdId){

      prodId=req.session.tempProdId;
      req.session.tempProdId=null;
       res.redirect('/product-detail-page?id='+prodId)
    }else{
      res.redirect('/')
    }
   
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
 // let Orders = await adminHelpers.viewAllPendingOrders()
let orders= await userHelper.getPendingOrderProducts(user._id)
 console.log(orders);
  res.render('user/profile-page',{user,orders})
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
  req.session.tempCart=null;

  user=req.session.user;
  userId=user._id;
  let products=null;
  let total=0;
  let length;
  let producttotal
  if(user){
     products=await userHelper.getCartProducts(req.session.user._id);
      length=products.length;
     
     if(products.length>0){
      total=await userHelper.getTotalAmount(req.session.user._id)
     }
    
  }
let a=10
  res.render('user/cart',{products,userId,total,length})

})


router.post('/checkPincode',async (req,res)=>{
 // var pincodeList=["683556", "683101", "683585","683547"];
//getpincode from backend
var response= await adminHelpers.validatePincode(req.body.pincode)

if(response){
  res.json({status:true})
}else{
  res.json({status:false})
}


})



router.get('/addtocart/:id/:weight',(req,res)=>{
  if(req.session.user){
    
    userHelper.addToCart(req.session.user._id,req.params.id,req.params.weight).then(()=>{
      res.json(req.params.id)
    })
  }else{
    res.json(false)
  }

  
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
  let coupon=null;
  let delivery = null;
  useraddress= await userHelper.getUserAddress(req.session.user._id)


delivery="cod";
  dlcharge=40;
  //delivery charge set from admin side 
    total=parseInt(req.query.fullTotal);

  Ttlamount=total+dlcharge;
let productTotal=req.query.producttotal;
coupon=req.query.coupon
  pincode=req.query.pincode;
  if(req.query.producttotal)
  res.render('user/checkout',{useraddress,pincode,total,dlcharge,Ttlamount,productTotal,coupon,delivery})
 
})

router.post('/checkout',async(req,res)=>{
  console.log(req.body)
  
  req.body.userId=req.session.user._id;
  user=req.session.user._id;
  usr=req.session.user;
  price=  parseInt(req.body.price);
  let products
  if(req.session.tempCart){
    
    products=req.session.tempCart 
    req.session.tempCartCheck=true;
  }else{
products=await userHelper.getCartProducts(user);
  }
  

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
  if( req.session.tempCartCheck){
  req.session.tempCart=null;
  req.session.tempCartCheck=false;
  }else{
    userHelper.deleteuserCart(user._id)
  }
  if(mode=='cod'){
    cod=true
  }
  else{
    cod=false
  }
  res.render('user/order-response',{user,cod})
})


router.post('/Validate-discount-coupon',async (req,res)=>{
let couponId=req.body.discountCode;
  let coupon=await userHelper.getCouponDetails(couponId)
  if(coupon){
    total=req.body.total-100;
    res.json({valid:true,total})
  }else{
    res.json({valid:false})
  }
    })
  
 
    router.get('/viewDetailedOrder',(req,res)=>{
let paymentmethod=null;
userHelper.getOrderDetails(req.query.id).then((response)=>{
  console.log(response);
  console.log("jjjjjjjjjjjeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee");
 console.log(response.paymentMethod);
  if(response.paymentMethod=="ONLINE"){
    console.log("keeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee");
    paymentmethod=response.paymentMethod;
  }
  res.render('user/viewDetailedOrder',{orderdata:response,paymentmethod})

})
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
  let product= await productHelper.getSingleProduct(req.body.proid)
 
  let proObj={
    quantity:req.body.quantity,
    item:req.body.proid,
   
    product
  }
  req.session.tempCart=proObj;

  res.json({success:true})
})


//product listing page
router.get('/products-page',async(req,res)=>{
  cakes=await productHelper.getProductCake()
  res.render('user/products-page',{cakes})
})

router.get('/product-detail-page', async(req,res)=>{
  let proId=req.query.id
  let product=await productHelper.getSingleProduct(proId)
   let cakes=await productHelper.getProductCake()
   
  res.render('user/product-detail-page',{product,cakes})
})



module.exports = router;
