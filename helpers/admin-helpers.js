var db=require('../config/connection')
var collection=require('../config/collection')
const { response } = require('../app')
const bcrypt=require('bcrypt')
var objectId=require('mongodb').ObjectID


module.exports={
    

     doLogin:(userData)=>{
        
        return new Promise(async (resolve,reject)=>{
            let loginStatus=false
            let response={}
            let admin=await db.get().collection(collection.ADMIN_COLLECTION).findOne({Email:userData.Email})
            
            if(admin){
                bcrypt.compare(userData.Password,admin.Password).then((status)=>{
                    if(status){
                        
                        response.admin=admin
                        response.status=true
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
                db.get().collection(collection.USER_COLLECTION).updateOne({_id:objectId(userId)},{ $set: { "status" : false } })

            }else{
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
      
      addCurrentSeason:(season)=>{
       
        return new Promise (async (resolve,reject)=>{
        db.get().collection(collection.SEASON_COLLECTION).remove({}).then(()=>{
            db.get().collection(collection.SEASON_COLLECTION).insertOne(season).then(()=>{
                resolve()
        })
        
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
            let pendingOrders = await db.get().collection(collection.ORDER_COLLECTION).find({status:'placed'}).toArray()
             resolve(pendingOrders)
         })

    },

    
    viewAlldeliveredOrders:()=>{
        return new Promise (async (resolve,reject)=>{
            let pendingOrders = await db.get().collection(collection.ORDER_COLLECTION).find({status:'delivered'}).toArray()
             resolve(pendingOrders)
         })

    },

    
    viewAllCancelledOrders:()=>{
        return new Promise (async (resolve,reject)=>{
            let pendingOrders = await db.get().collection(collection.ORDER_COLLECTION).find({status:'cancelled'}).toArray()
             resolve(pendingOrders)
         })

    },

    deliveredstatus:(Id)=>{
        return new Promise((resolve,reject)=>{
                db.get().collection(collection.ORDER_COLLECTION).updateOne({_id:objectId(Id)},{ $set: { "status" : 'delivered' } })
         resolve()
        })
    },
    cancelledstatus:(Id,errmsg)=>{
        return new Promise((resolve,reject)=>{
            console.log(Id);
            console.log(errmsg);
                db.get().collection(collection.ORDER_COLLECTION).updateOne({_id:objectId(Id)},{ $set: { status : 'cancelled' , errmsg: errmsg} })
         resolve()
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
                    deliveryMode:SiteDetails.deliveryMode,
                    deliveryCharge:SiteDetails.deliveryCharge
                }
                

            }).then((response)=>{
               
                resolve()
            }).catch((err)=>{

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

                reject()
            })
        })
    },
    addBaker(bakerDetails){
        return new Promise(async(resolve,reject)=>{
            db.get().collection(collection.BAKERS_COLLECTION).insertOne(bakerDetails).then((data)=>{
                resolve()
            })
        })
    },
    viewAllBakers(){
        return new Promise(async(resolve,reject)=>{
            let bakers = await db.get().collection(collection.BAKERS_COLLECTION).find().toArray()
            resolve(bakers)
        })
    },



    // calculateMonthlyRevenue:()=>{
    //     return new Promise(async(resolve,reject)=>{
    //         let date = new Date()
    //         let month = "Dec"
    //         console.log(month);
    //         let year = date.getFullYear()
    //         let revenue = await db.get().collection(collection.ORDER_COLLECTION).aggregate([
    //             {
    //                 $match:{status:'delivered'}
    //             },
    //             {
    //                 $project:{
                       
    //                     total:'$totalAmount'
    //                 }
    //             },
              
    //             {
    //                 $group:{
    //                     _id:null,
    //                     total:{$sum:'$totalAmount'}
    //                 }
    //             }
    //         ]).toArray()
    //         resolve(revenue)
    //     })
    // },

    // calculateDailyRevenue:()=>{
    //     return new Promise(async(resolve,reject)=>{
    //         let date = new Date()
    //         let day = date.getDate()
    //         let month = date.getMonth()
    //         let year = date.getFullYear()
    //         let revenue = await db.get().collection(collection.ORDER_COLLECTION).aggregate([
    //             {
    //                 $match:{status:'delivered'}
    //             },
    //             {
    //                 $project:{
    //                     day:{$dayOfMonth:'$date'},
    //                     month:{$month:'$date'},
    //                     year:{$year:'$date'},
    //                     total:{$sum:'$total'}
    //                 }
    //             },
    //             {
    //                 $match:{day:day,month:month,year:year}
    //             },
    //             {
    //                 $group:{
    //                     _id:null,
    //                     total:{$sum:'$total'}
    //                 }
    //             }
    //         ]).toArray()
    //         resolve(revenue)
    //     })
    // },

    
    
}