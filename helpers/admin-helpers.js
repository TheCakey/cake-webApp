var db=require('../config/connection')
var collection=require('../config/collection')
const { response } = require('../app')
const bcrypt=require('bcrypt')
var objectId=require('mongodb').ObjectID


module.exports={
    

     doLogin:(userData)=>{
         console.log(userData)
        
        return new Promise(async (resolve,reject)=>{
            let loginStatus=false
            let response={}
            let admin=await db.get().collection(collection.ADMIN_COLLECTION).findOne({Email:userData.Email})
            
            if(admin){
                bcrypt.compare(userData.Password,admin.Password).then((status)=>{
                    if(status){
                        
                        response.admin=admin
                        response.status=true
                        console.log(response);
                        resolve(response)
                    }else{
                       
                        resolve({status:false,error:"Password Does Not Match"})
                    }
                })
            }else{
            
                resolve({status:false,error:'Email Does Not Exist'})
            }
        })
    },


    //user 
    
    viewAllUser:()=>{
        return new Promise (async (resolve,reject)=>{
           let users = await db.get().collection(collection.USER_COLLECTION).find().toArray()
            resolve(users)
        })
      },

    manageUser:(userId,status)=>{
        return new Promise((resolve,reject)=>{
            if(status==='true'){
                console.log('hiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiii');
                db.get().collection(collection.USER_COLLECTION).updateOne({_id:objectId(userId)},{ $set: { "status" : false } })

            }else{
                console.log('hlooooooooooooooooooooooooooooooooooooooooooooo');
                db.get().collection(collection.USER_COLLECTION).updateOne({_id:objectId(userId)},{ $set: { "status" : true } })

            }
         resolve()
        })
    },

    deleteUser:(userId,status)=>{
        return new Promise((resolve,reject)=>{
            db.get().collection(collection.USER_COLLECTION).deleteOne({_id:objectId(userId)})
         resolve()
        })
    },

    //coupon

    addCoupon:(coupon)=>{
       
        return new Promise (async (resolve,reject)=>{
        db.get().collection(collection.COUPON_COLLECTION).insertOne(coupon).then(()=>{
        resolve()
        })        
        })
      },

      viewAllCoupons:()=>{
        return new Promise (async (resolve,reject)=>{
           let coupons = await db.get().collection(collection.COUPON_COLLECTION).find().toArray()
            resolve(coupons)
        })
      },
      
      deleteCoupon:(prodId)=>{
        console.log('product id display');
        console.log(prodId);
        return new Promise((resolve,reject)=>{
            db.get().collection(collection.COUPON_COLLECTION).deleteOne({_id:objectId(prodId)}).then((response)=>{               
                resolve(response)
            })
        })
    },

//category

      addCategory:(category)=>{
       
        return new Promise (async (resolve,reject)=>{
        db.get().collection(collection.CATEGORY_COLLECTION).insertOne(category).then(()=>{
        resolve()
        })        
        })
      },

      viewAllCategory:()=>{
        return new Promise (async (resolve,reject)=>{
           let category = await db.get().collection(collection.CATEGORY_COLLECTION).find().toArray()
            resolve(category)
        })
      },
      deleteCategory:(catId)=>{
        console.log('product id display');
        console.log(catId);
        return new Promise((resolve,reject)=>{
            db.get().collection(collection.CATEGORY_COLLECTION).deleteOne({_id:objectId(catId)}).then((response)=>{               
                resolve(response)
            })
        })
    },


      

      //order

      getAllorder:()=>{
        return new Promise (async (resolve,reject)=>{
           let orders = await db.get().collection(collection.ORDER_COLLECTION).find().toArray()
            resolve(orders)
        })
      },

      

    viewAllPendingOrders:()=>{
        return new Promise (async (resolve,reject)=>{
            let pendingOrders = await db.get().collection(collection.ORDER_COLLECTION).find().toArray()
             resolve(pendingOrders)
         })

    },


    //pincode
    addPincode:(pincode)=>{
        return new Promise (async (resolve,reject)=>{
        db.get().collection(collection.PINCODE_COLLECTION).insertOne(pincode).then(()=>{
            resolve()

        })
         
        })
 
      },
      viewAllPincodes:()=>{
        return new Promise (async (resolve,reject)=>{
           let pincodes = await db.get().collection(collection.PINCODE_COLLECTION).find().toArray()
         
       resolve(pincodes)
            
        })

      },
      validatePincode:(pincode)=>{
        return new Promise ((resolve,reject)=>{
            db.get().collection(collection.PINCODE_COLLECTION).findOne({Pincode:pincode}).then((res)=>{
           
                console.log(res);
                resolve(res)
       })
          
        })

      },
      
      getAllpincodes:()=>{
        return new Promise (async (resolve,reject)=>{
           let pincodes = await db.get().collection(collection.PINCODE_COLLECTION).find().toArray()
            resolve(pincodes)
        })
      },

      
      deletePincode:(pincode)=>{
        
      
        return new Promise((resolve,reject)=>{ 
            db.get().collection(collection.PINCODE_COLLECTION).deleteOne({_id:objectId(pincode)}).then((response)=>{
                resolve(response)
            })
        })
    },


    //site details

    getSiteDetails:()=>{
        return new Promise(async(resolve,reject)=>{
           let about = await db.get().collection(collection.SITE_COLLECTION).find().toArray()
           resolve(about)
        })
    },

    addSiteDetails:(details)=>{
       
        return new Promise (async (resolve,reject)=>{
        db.get().collection(collection.SITE_COLLECTION).insertOne(details).then(()=>{
        resolve()
        })        
        })
      },


    updateSite:(SiteDetails,siteId)=>{
        return new Promise(async(resolve,reject)=>{
      
            db.get().collection(collection.SITE_COLLECTION).updateOne({_id:objectId(siteId)},{
                $set:{
                    siteName:SiteDetails.siteName,
                    address:SiteDetails.address,
                    mob1:SiteDetails.mob1,
                    mob2:SiteDetails.mob1,
                    domainName:SiteDetails.domainName,
                    email:SiteDetails.email,
                    SiteDescription:SiteDetails.SiteDescription,
                    deliveryMode:SiteDetails.deliveryMode
                }
                

            }).then((response)=>{
               
                resolve()
            }).catch((err)=>{

                console.log(err);
                reject()
            })
        })
    },


    
    
    getSocialLinks:()=>{
        return new Promise(async(resolve,reject)=>{
           let links = await db.get().collection(collection.LINK_COLLECTION).find().toArray()
           resolve(links)
        })
    },

    addSocialLinks:(details)=>{
       
        return new Promise (async (resolve,reject)=>{
        db.get().collection(collection.LINK_COLLECTION).insertOne(details).then(()=>{
        resolve()
        })        
        })
      },

      updateSocialLinks:(SiteDetails,siteId)=>{
        return new Promise(async(resolve,reject)=>{
      
            db.get().collection(collection.SITE_COLLECTION).updateOne({_id:objectId(siteId)},{
                $set:{
                    siteName:SiteDetails.siteName,
                    address:SiteDetails.address,
                    mob1:SiteDetails.mob1,
                    mob2:SiteDetails.mob1,
                    domainName:SiteDetails.domainName,
                    email:SiteDetails.email,
                    SiteDescription:SiteDetails.SiteDescription,
                    deliveryMode:SiteDetails.deliveryMode
                }
                

            }).then((response)=>{
               
                resolve()
            }).catch((err)=>{

                console.log(err);
                reject()
            })
        })
    },

}