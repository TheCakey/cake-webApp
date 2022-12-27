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
let adminName=null;
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
  res.render('admin/index',{admin:true,users:usersList,usrlength,orderlength,productlength,pincodelength,adminName}); 
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
adminHelpers.doLogin(req.body).then((response)=>{

      if(response.status){
          req.session.admin=response.admin
          adminName=response.admin.name
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

  let status=req.query.status
  if(status==='true'){
  
    adminHelpers.manageUser(req.query.id,'true').then(()=>{
      res.redirect('/admin')
    })
  }
  else{
    adminHelpers.manageUser(req.query.id,'false').then(()=>{

      res.redirect('/admin')
    })
  }
})
router.get('/view-all-users',verifyLogin,async(req,res)=>{
  

  res.render('admin/view-all-users',{admin:true,users:usersList,adminName})
})


router.get('/delete-user',verifyLogin,(req,res)=>{

adminHelpers.deleteUser(req.query.id).then(()=>{
  res.redirect('/admin')
})

})


router.get('/product-add',verifyLogin,async (req,res)=>{
  let category = await adminHelpers.viewAllCategory()
  res.render('admin/products-add',{admin:true,category,adminName})
})

router.post('/products-add',(req,res)=>{
  console.log('1st stage');
  productHelpers.addProduct(req.body,async (id)=>{
    console.log('5st stage');
    //img1
    let image=req.files.Image1
    image.mv('./public/product-imagesfull/'+id+'1'+'.jpg', (err,done)=>{
      if(err){
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
   

    if(error){
      productHelpers.deleteProduct(id).then(()=>{
        res.render('admin/productError',{admin:true,adminlog:true})
      })
    }
     //img2
    
    image=req.files.Image2
    image.mv('./public/product-imagesfull/'+id+'2'+'.jpg', (err,done)=>{

      if(err){ 
        productHelpers.deleteProduct(id).then(()=>{
          res.render('admin/productError',{admin:true,adminlog:true})
        })
      }    
else{

      var INPUT_path_to_your_images = './public/product-imagesfull/'+id+'2'+'.jpg';
      var OUTPUT_path = './public/product-images/';
      
       compress_images(INPUT_path_to_your_images, OUTPUT_path, { compress_force: false, statistic: true, autoupdate: true }, false,
        { jpg: { engine: "mozjpeg", command: ["-quality", "60"] } },
        { png: { engine: "pngquant", command: ["--quality=20-50", "-o"] } },
        { svg: { engine: "svgo", command: "--multipass" } },
        { gif: { engine: "gifsicle", command: ["--colors", "64", "--use-col=web"] } },
function (error, completed, statistic) {


if(error){
  console.log("deleteddddddddddddddddd111111111111111");
  productHelpers.deleteProduct(id).then(()=>{
    res.render('admin/productError',{admin:true,adminlog:true})
  })
}

//img3
    image=req.files.Image3
    image.mv('./public/product-imagesfull/'+id+'3'+'.jpg', (err,done)=>{
      if(err){
       
        productHelpers.deleteProduct(id).then(()=>{
          console.log("deleteddddddddddddddddd2222222222222222");

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
        
           if(error){
            productHelpers.deleteProduct(id).then(()=>{
              console.log("deleteddddddddddddddddd3333333333333333");

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
 console.log('6st stage');
     res.redirect('/admin/product-add')
          })
  })



//product management
router.get('/view-all-cakes',verifyLogin,async (req,res)=>{
  let cakes=await productHelpers.getProductCake()
 
  console.log(cakes);
  res.render('admin/view-all-products',{admin:true,cakes,adminName})
})

router.get('/edit-cakes',verifyLogin,async(req,res)=>{
  let proId=req.query.id
    let product=await productHelpers.getSingleProduct(proId)
    let category = await adminHelpers.viewAllCategory()
    res.render('admin/edit-products',{admin:true,product,category,adminName})

})

router.post('/edit-cakes',verifyLogin,async(req,res)=>{

  let proId=req.query.id
 
  productHelpers.updateProduct(req.body,proId).then(async()=>{
 
    if(req.files){
    

      let image=req.files.Image1

      if(image){
       await image.mv('./public/product-imagesfull/'+proId+'1'+'.jpg',(err,done)=>{
          if(err){
              res.render('admin/productError',{admin:true,adminlog:true})
          }else{
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
        image2.mv('./public/product-imagesfull/'+proId+'2'+'.jpg',(err,done)=>{
          if(err){
          
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
            
               if(error){
              
                  res.render('admin/productError',{admin:true,adminlog:true})
                
               
               }
      
              }
            )
          
           
          }else{
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

router.get('/delete-product',verifyLogin, (req,res)=>{
 id=req.query.id
  productHelpers.deleteProduct(id).then(()=>{
    
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





//Coupon

router.get('/add-coupon',verifyLogin,(req,res)=>{
  
  res.render('admin/add-coupon',{admin:true,adminName})
})
router.post('/add-coupon',(req,res)=>{
  adminHelpers.addCoupon(req.body).then(async(res)=>{
    res.redirect('/admin/view-all-coupons')

  })
})

router.get('/view-all-coupons',verifyLogin,async(req,res)=>{
  let coupons = await adminHelpers.viewAllCoupons()
  console.log(coupons)
  res.render('admin/view-all-coupons',{admin:true,coupons,adminName})
})

router.get('/delete-coupon',(req,res)=>{
  let proId=req.query.id
  adminHelpers.deleteCoupon(proId).then((response)=>{
    res.redirect('/admin/view-all-coupons')
  })

})



//category

router.get('/add-category',verifyLogin,(req,res)=>{
  
  res.render('admin/add-category',{admin:true,adminName})
})
router.post('/add-category',(req,res)=>{
  adminHelpers.addCategory(req.body).then(async()=>{
    res.redirect('/admin/view-all-category')

  })
})

router.get('/current-season',verifyLogin,async(req,res)=>{
  let category = await adminHelpers.viewAllCategory()
  res.render('admin/current-season',{admin:true,category})
})

router.post('/add-current-season',(req,res)=>{
  adminHelpers.addCurrentSeason(req.body).then(async()=>{
    res.redirect('/admin/view-all-category')

  })
})




router.get('/view-all-category',verifyLogin,async(req,res)=>{
  let category = await adminHelpers.viewAllCategory()
  console.log(category)
  res.render('admin/view-all-category',{admin:true,category,adminName})
})

router.get('/delete-category',verifyLogin,(req,res)=>{
  let catId=req.query.id
  adminHelpers.deleteCategory(catId).then((response)=>{
    res.redirect('/admin/view-all-category')
  })

})


//orders
router.get('/pending-orders',verifyLogin,async (req,res)=>{
  let pendingOrders = await adminHelpers.viewAllPendingOrders()
  console.log(pendingOrders)
  res.render('admin/pending-orders',{admin:true,pendingOrders,adminName})
})

router.get('/delivered-order',verifyLogin,async (req,res)=>{
  let deliveredOrders = await adminHelpers.viewAlldeliveredOrders()
  console.log(deliveredOrders)
  res.render('admin/delivered-orders',{admin:true,deliveredOrders,adminName})
})

router.get('/cancelled-orders',verifyLogin,async (req,res)=>{
  let cancelledOrders = await adminHelpers.viewAllCancelledOrders()
  console.log(cancelledOrders)
  res.render('admin/cancelled-orders',{admin:true,cancelledOrders,adminName})
})


router.get('/deliveredstatus',verifyLogin,(req,res)=>{
  
    adminHelpers.deliveredstatus(req.query.id).then(()=>{
      res.redirect('/admin/pending-orders')
    })
})


router.get('/cancelledstatus',verifyLogin,(req,res)=>{
  
    adminHelpers.cancelledstatus(req.query.id).then(()=>{
      res.redirect('/admin/pending-orders')
    })
})




// Pincode 

router.get('/add-pincode',verifyLogin,(req,res)=>{
  
  res.render('admin/add-pincode',{admin:true,adminName})
})
router.post('/add-pincode',(req,res)=>{
  adminHelpers.addPincode(req.body).then(()=>{

    res.redirect('/admin/view-all-pincodes')
  })
})


router.get('/view-all-pincodes',verifyLogin,async(req,res)=>{
  let pincodes = await adminHelpers.viewAllPincodes()
  console.log(pincodes)
  res.render('admin/view-all-pincodes',{admin:true,pincodes,adminName})
})

router.get('/delete-pincode',verifyLogin,(req,res)=>{
  let proId=req.query.id
  adminHelpers.deletePincode(proId).then((response)=>{
    res.redirect('/admin/view-all-pincodes')
  })

})


//site dynamic

router.get('/aboutSection',verifyLogin,async(req,res)=>{
    let about=await adminHelpers.getSiteDetails()
    if(about.length !== 0){
      res.render('admin/editAboutSection',{admin:true,about,adminName})
     
    }else{
      res.render('admin/addAboutSection',{admin:true})
    }
})

router.post('/addAboutSection',verifyLogin,async(req,res)=>{
  adminHelpers.addSiteDetails(req.body).then((result)=>{

if(req.files){

    let image=req.files.Image1
  image.mv('./public/img/master-carasoul-1.jpg',(err,done)=>{
    if(err){
      console.log("err1"+err)
    }
    
  })

  let image1=req.files.Image2
  image1.mv('./public/img/master-carasoul-2.jpg',(err,done)=>{
    if(err){
      console.log("err2"+err)
    }

   
  })
  res.redirect('/admin')

}
})


})

router.post('/editAboutSection',verifyLogin,async(req,res)=>{
  let id = req.body.siteid;
  adminHelpers.updateSite(req.body,id).then(()=>{
    let image=req.files.Image1
    image.mv('./public/img/master-carasoul-1.jpg',(err,done)=>{
      if(err){
        console.log(err)
      }
      
    })
  
    let image1=req.files.Image2
    image1.mv('./public/img/master-carasoul-2.jpg',(err,done)=>{
      if(err){
        console.log(err)
      }
  
     
    })
    res.redirect('/admin')
  })
})


//site social links

router.get('/linksection',verifyLogin,async(req,res)=>{
  let links=await adminHelpers.getSocialLinks()
  if(links.length !== 0){
    res.render('admin/editSocialLinks',{admin:true,links,adminName})
   
  }else{
    res.render('admin/addSocialLinks',{admin:true,adminName})
  }
})

router.post('/addSocialLinks',verifyLogin,async(req,res)=>{
  adminHelpers.addSocialLinks(req.body).then(()=>{
    res.redirect('/admin')
  })
})

router.post('/editSocialLinks',verifyLogin,async(req,res)=>{
  let id = req.body.id;
  adminHelpers.updateSocialLinks(req.body,id).then(()=>{
    res.redirect('/admin')
  })
})

router.get('/viewPendingOrders',verifyLogin,async(req,res)=>{
  let paymentmethod=null;
  userHelper.getOrderDetails(req.query.id).then((response)=>{

    if(response.paymentMethod=="ONLINE"){
      paymentmethod=response.paymentMethod;
    }
    res.render('admin/viewPendingOrders',{admin:true,orderdata:response,paymentmethod,adminName})
  
  })
  
  })
  router.get('/calculateMonthlyRevenue',async(req,res)=>{
    let revenue=await adminHelpers.calculateMonthlyRevenue()
    console.log(revenue)
res.json(revenue)
    // res.render('admin/monthlyRevenue',{admin:true,revenue})
  })


  router.get('/add-baker',verifyLogin,(req,res)=>{
    res.render('admin/add-baker',{admin:true,adminName})
  })
  router.get('/view-all-bakers',verifyLogin,async(req,res)=>{
    let bakers=await adminHelpers.viewAllBakers()
    console.log(bakers)
    res.render('admin/view-all-bakers',{admin:true,bakers,adminName})
  })
  router.post('/add-baker',verifyLogin,(req,res)=>{
    adminHelpers.addBaker(req.body).then(()=>{
      res.redirect('/admin')
    })
  })

  

module.exports = router;
