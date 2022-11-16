var express = require('express');
const { log } = require('handlebars');
var router = express.Router();



const adminHelpers=require('../helpers/admin-helpers')
const productHelpers=require('../helpers/product-helpers')

let usersList; 
let ordersList;
let productList;
let pincodeList;

const verifyLogin=(req,res,next)=>{
  if(req.session.adminLoggedIn){
      next()
  }else{
      res.redirect('/admin/login')
  }
}


/* GET users listing. */
router.get('/',async function(req, res, next) {

if(req.session.adminLoggedIn){
   usersList=await adminHelpers.viewAllUser()
   ordersList=await adminHelpers.getAllorder();
   pincodeList=await adminHelpers.getAllpincodes();
   productList=await productHelpers.getProductCake();
  let usrlength = usersList.length;
  let orderlength = ordersList.length;
  let productlength = productList.length;
  let pincodelength = pincodeList.length;
  res.render('admin/index',{admin:true,users:usersList,usrlength,orderlength,productlength,pincodelength}); 
}
else{
  res.redirect('admin/login')
}
 
});



//admin login--------------------------------------

router.get('/login', (req,res)=>{
if(!req.session.adminLoggedIn){
  res.render('admin/login',{admin:true,adminlog:true,"loginErr":req.session.adminloginErr})
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

router.get('/logout',(req,res)=>{
  req.session.admin=null;
  req.session.adminLoggedIn=false;
  res.redirect('/admin/login')
})
router.get('/admin-dashboard',(req,res)=>{
  res.render('admin/admin-dashboard',{admin:true})
})


router.get('/change-user-status',verifyLogin,(req,res)=>{
  console.log(req.query.id)
  console.log(req.query.status);
  console.log(req.query.status+'   dfffffffffffffffffffffffffffffff');
  let status=req.query.status
  if(status==='true'){
  
    adminHelpers.manageUser(req.query.id,'true').then(()=>{
      console.log('Blocked')
      res.redirect('/admin')
    })
  }
  else{
    adminHelpers.manageUser(req.query.id,'false').then(()=>{
      console.log('unBlocked')
      res.redirect('/admin')
    })
  }
})

router.get('/delete-user',verifyLogin,(req,res)=>{

adminHelpers.deleteUser(req.query.id).then(()=>{
  res.redirect('/admin')
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
        res.redirect('/admin/product-add')
      }else{
        console.log(err)
      } 
    })
  })

})


//product management
router.get('/view-all-cakes',async (req,res)=>{
  let cakes=await productHelpers.getProductCake()
 
  console.log(cakes);
  res.render('admin/view-all-products',{admin:true,cakes})
})

router.get('/edit-cakes',async(req,res)=>{
  let proId=req.query.id
console.log(proId);
    let product=await productHelpers.getSingleProduct(proId)
    res.render('admin/edit-products',{admin:true,product})

})

router.post('/edit-cakes',async(req,res)=>{

  let proId=req.query.id
  console.log("proID below")
  console.log(proId)
  productHelpers.updateProduct(req.body,proId).then(()=>{
    res.redirect('/admin')
    if(req.files.Image){
      let image=req.files.Image1
      image.mv('./public/product-images/'+proId+'1'+'.jpg',(err,done)=>{
        if(err){
        
          console.log(err)
        }
        
      })
    
      image=req.files.Image2
      image.mv('./public/product-images/'+proId+'2'+'.jpg',(err,done)=>{
        if(err){
        
          console.log(err)
        }
        
      })
    
      image=req.files.Image3
      image.mv('./public/product-images/'+proId+'3'+'.jpg',(err,done)=>{
        if(!err){
          res.redirect('/admin')
        }else{
          console.log(err)
        }
        
      })
    }
  })
})





//Coupon

router.get('/add-coupon',(req,res)=>{
  
  res.render('admin/add-coupon',{admin:true})
})
router.post('/add-coupon',(req,res)=>{
  console.log(req.body)
  adminHelpers.addCoupon(req.body).then(async()=>{
    console.log('coupon added successfully')
    let coupons = await adminHelpers.viewAllCoupons()

    res.render('admin/view-all-coupons',{admin:true,coupons})
  })
})

router.get('/view-all-coupons',async(req,res)=>{
  let coupons = await adminHelpers.viewAllCoupons()
  console.log(coupons)
  res.render('admin/view-all-coupons',{admin:true,coupons})
})

router.get('/delete-coupon',(req,res)=>{
  let proId=req.query.id
  console.log(proId)
  adminHelpers.deleteCoupon(proId).then((response)=>{
    console.log('Coupen deleted succesfully')
    res.redirect('/admin/view-all-coupons')
  })

})


router.get('/pending-orders',async (req,res)=>{
  let pendingOrders = await adminHelpers.viewAllPendingOrders()
  console.log(pendingOrders)
  res.render('admin/pending-orders',{admin:true,pendingOrders})
})

router.get('/add-pincode',(req,res)=>{
  
  res.render('admin/add-pincode',{admin:true})
})
router.post('/add-pincode',(req,res)=>{
  console.log(req.body)
  adminHelpers.addPincode(req.body).then(()=>{
    console.log('pincode added successfully')

    res.redirect('/admin/view-all-pincodes')
  })
})


router.get('/view-all-pincodes',async(req,res)=>{
  let pincodes = await adminHelpers.viewAllPincodes()
  console.log(pincodes)
  res.render('admin/view-all-pincodes',{admin:true,pincodes})
})

router.get('/delete-pincode',(req,res)=>{
  let proId=req.query.id
  console.log(proId)
  adminHelpers.deletePincode(proId).then((response)=>{
    console.log('Pincode deleted succesfully')
    res.redirect('/admin/view-all-pincodes')
  })

})


module.exports = router;
