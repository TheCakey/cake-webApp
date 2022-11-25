var express = require('express');
const { log } = require('handlebars');
var router = express.Router();
var fs = require('fs');
const compress_images = require("compress-images");

const adminHelpers=require('../helpers/admin-helpers')
const productHelpers=require('../helpers/product-helpers')
const userHelper=require('../helpers/user-helpers')

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


router.get('/product-add',async (req,res)=>{
  let category = await adminHelpers.viewAllCategory()
  res.render('admin/products-add',{admin:true,category})
})

router.post('/products-add',(req,res)=>{
 
  productHelpers.addProduct(req.body,async (id)=>{
    
    //img1
    let image=req.files.Image1
    image.mv('./public/product-imagesfull/'+id+'1'+'.jpg', (err,done)=>{
      if(err){
        console.log(err)
        productHelpers.deleteProduct(id).then(()=>{
          res.render('admin/productError',{admin:true,adminlog:true})
        })
      
      }
else{
var INPUT_path_to_your_images = './public/product-imagesfull/'+id+'1'+'.jpg';
var OUTPUT_path = './public/product-images/';

 compress_images(INPUT_path_to_your_images, OUTPUT_path, { compress_force: false, statistic: true, autoupdate: true }, false,
                { jpg: { engine: "mozjpeg", command: ["-quality", "60"] } },
                { png: { engine: "pngquant", command: ["--quality=20-50", "-o"] } },
                { svg: { engine: "svgo", command: "--multipass" } },
                { gif: { engine: "gifsicle", command: ["--colors", "64", "--use-col=web"] } },
  function (error, completed, statistic) {
    console.log("-------------");
    console.log(error);
    console.log(completed);
    console.log(statistic);
    console.log("-------------");

    if(error){
      productHelpers.deleteProduct(id).then(()=>{
        res.render('admin/productError',{admin:true,adminlog:true})
      })
    }
     //img2
    
    image=req.files.Image2
    console.log(image);
    image.mv('./public/product-imagesfull/'+id+'2'+'.jpg', (err,done)=>{

      if(err){ 
        console.log(err)
        productHelpers.deleteProduct(id).then(()=>{
          res.render('admin/productError',{admin:true,adminlog:true})
        })
      }    
else{
  console.log("image 2 real started")

      var INPUT_path_to_your_images = './public/product-imagesfull/'+id+'2'+'.jpg';
      var OUTPUT_path = './public/product-images/';
      
       compress_images(INPUT_path_to_your_images, OUTPUT_path, { compress_force: false, statistic: true, autoupdate: true }, false,
        { jpg: { engine: "mozjpeg", command: ["-quality", "60"] } },
        { png: { engine: "pngquant", command: ["--quality=20-50", "-o"] } },
        { svg: { engine: "svgo", command: "--multipass" } },
        { gif: { engine: "gifsicle", command: ["--colors", "64", "--use-col=web"] } },
function (error, completed, statistic) {
console.log("-------------");
console.log(error);
console.log(completed);
console.log(statistic);
console.log("-------------");

if(error){
  productHelpers.deleteProduct(id).then(()=>{
    res.render('admin/productError',{admin:true,adminlog:true})
  })
}

//img3
    image=req.files.Image3
    image.mv('./public/product-imagesfull/'+id+'3'+'.jpg', (err,done)=>{
      if(err){
        console.log(err)
        productHelpers.deleteProduct(id).then(()=>{
          res.render('admin/productError',{admin:true,adminlog:true})
        })
      }else{

       

        var INPUT_path_to_your_images = './public/product-imagesfull/'+id+'3'+'.jpg';
        var OUTPUT_path = './public/product-images/';
        
         compress_images(INPUT_path_to_your_images, OUTPUT_path, { compress_force: false, statistic: true, autoupdate: true }, false,
                        { jpg: { engine: "mozjpeg", command: ["-quality", "60"] } },
                        { png: { engine: "pngquant", command: ["--quality=20-50", "-o"] } },
                        { svg: { engine: "svgo", command: "--multipass" } },
                        { gif: { engine: "gifsicle", command: ["--colors", "64", "--use-col=web"] } },
          function (error, completed, statistic) {
            console.log(error);
            console.log(completed);
            console.log(statistic);
           if(error){
            productHelpers.deleteProduct(id).then(()=>{
              res.render('admin/productError',{admin:true,adminlog:true})
            })
           }
  
          }
        )
        }  
            })
     
       
        }
      );
}
            
          })
   
  }
);
}
 })

     res.redirect('/admin/product-add')
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
  productHelpers.updateProduct(req.body,proId).then(async()=>{
    console.log("hiiiiii");
    console.log(req.files)
    if(req.files){
    

      let image=req.files.Image1

      if(image){
        console.log("image11111111111111111111111111");
       await image.mv('./public/product-imagesfull/'+proId+'1'+'.jpg',(err,done)=>{
          if(err){
            console.log(err)
              res.render('admin/productError',{admin:true,adminlog:true})
          }else{
            console.log("error not here")
            var img='./public/product-images/'+proId+'1'+'.jpg';
            fs.unlinkSync(img);
            var INPUT_path_to_your_images = './public/product-imagesfull/'+proId+'1'+'.jpg';
            var OUTPUT_path = './public/product-images/';
            
             compress_images(INPUT_path_to_your_images, OUTPUT_path, { compress_force: false, statistic: true, autoupdate: true }, false,
                            { jpg: { engine: "mozjpeg", command: ["-quality", "60"] } },
                            { png: { engine: "pngquant", command: ["--quality=20-50", "-o"] } },
                            { svg: { engine: "svgo", command: "--multipass" } },
                            { gif: { engine: "gifsicle", command: ["--colors", "64", "--use-col=web"] } },
              function (error, completed, statistic) {
                console.log(error);
                console.log(completed);
                console.log(statistic);
               if(error){
              
                  res.render('admin/productError',{admin:true,adminlog:true})
                
               }
      
              }
            )
          }
          
        })
      }
      
    
     let image2=req.files.Image2

      if(image2){
        console.log("image2222222222222222222");
        image2.mv('./public/product-imagesfull/'+proId+'2'+'.jpg',(err,done)=>{
          if(err){
          
            console.log(err)
            res.render('admin/productError',{admin:true,adminlog:true})
          }
        else{
          var img='./public/product-images/'+proId+'2'+'.jpg';
          fs.unlinkSync(img);
          var INPUT_path_to_your_images = './public/product-imagesfull/'+proId+'2'+'.jpg';
          var OUTPUT_path = './public/product-images/';
          
           compress_images(INPUT_path_to_your_images, OUTPUT_path, { compress_force: false, statistic: true, autoupdate: true }, false,
                          { jpg: { engine: "mozjpeg", command: ["-quality", "60"] } },
                          { png: { engine: "pngquant", command: ["--quality=20-50", "-o"] } },
                          { svg: { engine: "svgo", command: "--multipass" } },
                          { gif: { engine: "gifsicle", command: ["--colors", "64", "--use-col=web"] } },
            function (error, completed, statistic) {
              console.log(error);
              console.log(completed);
              console.log(statistic);
             if(error){
            
                res.render('admin/productError',{admin:true,adminlog:true})
              
             }
    
            }
          )
        }
          
        })

      }
    
    
     let image3=req.files.Image3
      if(image3){
        console.log("image33333333333333333333333");
        image3.mv('./public/product-imagesfull/'+proId+'3'+'.jpg',(err,done)=>{
          if(!err){
  
            var img='./public/product-images/'+proId+'3'+'.jpg';
            fs.unlinkSync(img);
            var INPUT_path_to_your_images = './public/product-imagesfull/'+proId+'3'+'.jpg';
            var OUTPUT_path = './public/product-images/';
            
             compress_images(INPUT_path_to_your_images, OUTPUT_path, { compress_force: false, statistic: true, autoupdate: true }, false,
                            { jpg: { engine: "mozjpeg", command: ["-quality", "60"] } },
                            { png: { engine: "pngquant", command: ["--quality=20-50", "-o"] } },
                            { svg: { engine: "svgo", command: "--multipass" } },
                            { gif: { engine: "gifsicle", command: ["--colors", "64", "--use-col=web"] } },
              function (error, completed, statistic) {
                console.log(error);
                console.log(completed);
                console.log(statistic);
               if(error){
              
                  res.render('admin/productError',{admin:true,adminlog:true})
                
               
               }
      
              }
            )
          
           
          }else{
            console.log(err)
            res.render('admin/productError',{admin:true,adminlog:true})
          }
          
        })
      }
      res.redirect('/admin/view-all-cakes')
    }else{
      res.redirect('/admin/view-all-cakes')
    }
  })
})

router.get('/delete-product', (req,res)=>{
 id=req.query.id
  productHelpers.deleteProduct(id).then(()=>{
    console.log(req.query.id)
    
    var img1 = './public/product-images/'+id+'1'+'.jpg'; 
    var img2 = './public/product-images/'+id+'2'+'.jpg'; 
    var img3 = './public/product-images/'+id+'3'+'.jpg'; 

    var imgf1 = './public/product-imagesfull/'+id+'1'+'.jpg'; 
    var imgf2 = './public/product-imagesfull/'+id+'2'+'.jpg'; 
    var imgf3 = './public/product-imagesfull/'+id+'3'+'.jpg'; 

    fs.unlinkSync(img1)
      fs.unlinkSync(img2)
        fs.unlinkSync(img3)
          fs.unlinkSync(imgf1)
             fs.unlinkSync(imgf2)
               fs.unlinkSync(imgf3)
          res.redirect('/admin')
       
  })
})



//62dff3e8d486bd431653b096


//Coupon

router.get('/add-coupon',(req,res)=>{
  
  res.render('admin/add-coupon',{admin:true})
})
router.post('/add-coupon',(req,res)=>{
  console.log(req.body)
  adminHelpers.addCoupon(req.body).then(async()=>{
    console.log('coupon added successfully')
    res.redirect('/admin/view-all-coupons')

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



//category

router.get('/add-category',(req,res)=>{
  
  res.render('admin/add-category',{admin:true})
})
router.post('/add-category',(req,res)=>{
  console.log(req.body)
  adminHelpers.addCategory(req.body).then(async()=>{
    console.log('category added successfully')
    res.redirect('/admin/view-all-category')

  })
})

router.get('/view-all-category',async(req,res)=>{
  let category = await adminHelpers.viewAllCategory()
  console.log(category)
  res.render('admin/view-all-category',{admin:true,category})
})

router.get('/delete-category',(req,res)=>{
  let catId=req.query.id
  console.log(catId)
  adminHelpers.deleteCategory(catId).then((response)=>{
    console.log('Coupen deleted succesfully')
    res.redirect('/admin/view-all-category')
  })

})


//orders
router.get('/pending-orders',async (req,res)=>{
  let pendingOrders = await adminHelpers.viewAllPendingOrders()
  console.log(pendingOrders)
  res.render('admin/pending-orders',{admin:true,pendingOrders})
})

router.get('/delivered-order',async (req,res)=>{
  let deliveredOrders = await adminHelpers.viewAlldeliveredOrders()
  console.log(deliveredOrders)
  res.render('admin/delivered-orders',{admin:true,deliveredOrders})
})

router.get('/cancelled-orders',async (req,res)=>{
  let cancelledOrders = await adminHelpers.viewAllCancelledOrders()
  console.log(cancelledOrders)
  res.render('admin/cancelled-orders',{admin:true,cancelledOrders})
})


router.get('/deliveredstatus',verifyLogin,(req,res)=>{
  console.log(req.query.id)
  
    adminHelpers.deliveredstatus(req.query.id).then(()=>{
      res.redirect('/admin/pending-orders')
    })
})


router.get('/cancelledstatus',verifyLogin,(req,res)=>{
  console.log(req.query.id)
  
    adminHelpers.cancelledstatus(req.query.id).then(()=>{
      res.redirect('/admin/pending-orders')
    })
})




// Pincode 

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


//site dynamic

router.get('/aboutSection',async(req,res)=>{
    let about=await adminHelpers.getSiteDetails()
console.log(about)
    if(about.length !== 0){
      res.render('admin/editAboutSection',{admin:true,about})
     
    }else{
      res.render('admin/addAboutSection',{admin:true})
    }
})

router.post('/addAboutSection',async(req,res)=>{
  adminHelpers.addSiteDetails(req.body).then(()=>{
    res.redirect('/admin')
  })
})

router.post('/editAboutSection',async(req,res)=>{
  let id = req.body.siteid;
console.log(req.body)
  adminHelpers.updateSite(req.body,id).then(()=>{
    res.redirect('/admin')
  })
})


//site social links

router.get('/linksection',async(req,res)=>{
  let links=await adminHelpers.getSocialLinks()
console.log(links)
  if(links.length !== 0){
    res.render('admin/editSocialLinks',{admin:true,links})
   
  }else{
    res.render('admin/addSocialLinks',{admin:true})
  }
})

router.post('/addSocialLinks',async(req,res)=>{
  adminHelpers.addSocialLinks(req.body).then(()=>{
    res.redirect('/admin')
  })
})

router.post('/editSocialLinks',async(req,res)=>{
  let id = req.body.id;
console.log(req.body)
  adminHelpers.updateSocialLinks(req.body,id).then(()=>{
    res.redirect('/admin')
  })
})

router.get('/viewPendingOrders',async(req,res)=>{
  let paymentmethod=null;
  userHelper.getOrderDetails(req.query.id).then((response)=>{
    console.log(response);
    console.log("jjjjjjjjjjjeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee");
   console.log(response.paymentMethod);
    if(response.paymentMethod=="ONLINE"){
      console.log("keeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee");
      paymentmethod=response.paymentMethod;
    }
    res.render('admin/viewPendingOrders',{admin:true,orderdata:response,paymentmethod})
  
  })
  
  })
  

module.exports = router;
