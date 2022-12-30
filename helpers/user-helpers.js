var db=require('../config/connection')
var collection=require('../config/collection')
const { response } = require('../app')
const bcrypt=require('bcrypt')
var moment = require('moment'); 
const Razorpay= require('razorpay');
const { resolve } = require('path');
const objectId=require('mongodb').ObjectId
var instance = new Razorpay({
    key_id: 'rzp_test_wwlKdN1HEsAggm',
    key_secret: 'hIB4Fe2CyR04m633aO8507ll',
  });

module.exports={


    registerUser:(userData)=>{
        return new Promise(async(resolve,reject)=>{
        userData.psw=await bcrypt.hash(userData.psw,10)
        db.get().collection(collection.USER_COLLECTION).insertOne(userData).then
            resolve(userData)
        })
    },

    userPassLogin:(userData)=>{
       
       return new Promise(async (resolve,reject)=>{
           let loginStatus=false;
           let response={}
           let user=await db.get().collection(collection.USER_COLLECTION).findOne({mobnum:userData.mobnum})
           
           if(user){
               bcrypt.compare(userData.psw,user.psw).then((status)=>{
                   if(status){
                       response.user=user
                       response.status=true
                       resolve(response)
                   }else{
                       resolve({status:false,error:"Password Does Not Match"})
                   }
               })
           }else{
               resolve({status:false,error:'Mobile number Does Not Exist'})
           }
       })
   },
   
    findUserByMobNum:(mobNum)=>{
        return new Promise(async (resolve,reject)=>{
            let user=null;
         user= await db.get().collection(collection.USER_COLLECTION).findOne({mobnum:mobNum})
         
            resolve(user)
         
         
        })
    },

    editUserDetails:(userData,id)=>{
return new Promise(async(resolve,reject)=>{
    db.get().collection(collection.USER_COLLECTION).updateOne({_id:objectId(id)},{$set: {fullname:userData.fullname,permanentaddress:userData.permanentaddress,pincode:userData.pincode,altNum:userData.altNum,district:userData.district,state:userData.state }}).then(async ()=>{
        user= await db.get().collection(collection.USER_COLLECTION).findOne({_id:objectId(id)})
        resolve(user)
    })
})
    },

    addToCart:(userId,proId)=>{
        let proObj={
            item:objectId(proId),
            quantity:1
        }
        return new Promise(async(resolve,reject)=>{
            let userCart=await db.get().collection(collection.CART_COLLECTION).findOne({user:objectId(userId)})
            if(userCart){
                
                    let proExist=userCart.product.findIndex(product=> product.item==proId)
              
                    if(proExist!=-1){
                        db.get().collection(collection.CART_COLLECTION)
                        .updateOne({user:objectId(userId),'product.item':objectId(proId)},
                        {
                            $inc:{'product.$.quantity':1}
                        }
                        ).then(()=>{
                            resolve()
                            
                        })
                    }else{
                db.get().collection(collection.CART_COLLECTION).updateOne({user:objectId(userId)},
                {
                   
                        $push:{product:proObj}
                    
                }).then((response)=>{
                    resolve()
                })
            }
            }  
            else{
                cartObj={
                    user:objectId(userId),
                    product:[proObj]
                }
    
                db.get().collection(collection.CART_COLLECTION).insertOne(cartObj).then((result)=>{
                    resolve()
                })
            }
        })

    },
    getCartProducts:(userId)=>{
        return new Promise(async(resolve,reject)=>{
            let cartItems=await db.get().collection(collection.CART_COLLECTION).aggregate([
                {
                    $match:{user:objectId(userId)}
                },
                {
                    $unwind:'$product'
                },{
                    $project:{
                        item:'$product.item',
                        quantity:'$product.quantity',
                        weight:'$product.weight',
                        message:'$product.message'
                    }
                },
                {
                    $lookup:{
                        from:collection.PRODUCT_COLLECTION,
                        localField:'item',
                        foreignField:'_id',
                        as:'product'
                    }
                },
                {
                    $project:{
                       item:1,quantity:1,weight:1,message:1,product:{$arrayElemAt:['$product',0]}
                    }
                }

            ]).toArray()
            
            resolve(cartItems)
            
        })
    },
    

    changeProductQuantity:(details)=>{
        count=parseInt(details.count)
        quantity=parseInt(details.quantity)
        return new Promise((resolve,reject)=>{
            if(count==-1 && quantity==1){
                db.get().collection(collection.CART_COLLECTION)
                .updateOne({_id:objectId(details.cart)},
                {
                    $pull:{product:{item:objectId(details.product)}}
                }
                ).then((response)=>{
                    resolve({removeProduct:true})
                })
            }else{
                db.get().collection(collection.CART_COLLECTION)
                .updateOne({_id:objectId(details.cart),'product.item':objectId(details.product)},
                {
                    $inc:{'product.$.quantity':count}
                }
                ).then((response)=>{
                   
                    resolve({status:true})
                    
                })
            }
           
        })
    },

    removeCartProducts:(details)=>{
        return new Promise((resolve,reject)=>{
            db.get().collection(collection.CART_COLLECTION)
            .updateOne({_id:objectId(details.cart)},
            {
                $pull:{product:{item:objectId(details.product)}}
            }).then((response)=>{
                resolve({removeProduct:true})
            })
        })
    },

    getTotalAmount:(userId)=>{
        return new Promise(async(resolve,reject)=>{
            
          let  total=await db.get().collection(collection.CART_COLLECTION).aggregate([
                {
                    $match:{user:objectId(userId)}
                },
                {
                    $unwind:'$product'
                },{
                    $project:{
                        item:'$product.item',
                        quantity:'$product.quantity',
                        weight:'$product.weight'
                    }
                },
                {
                    $lookup:{
                        from:collection.PRODUCT_COLLECTION,
                        localField:'item',
                        foreignField:'_id',
                        as:'product'
                    }
                },
                {
                    $project:{
                       item:1,quantity:1,weight:1,product:{$arrayElemAt:['$product',0]}
                    }
                },
                {
                    
                    $group:{
                        _id:null,
                        
                        total:{$sum:{$multiply: ['$quantity', {$toInt: '$product.Price'},'$weight']}}
                    }
                }

            ]).toArray()
       
            resolve(total[0].total)
           
        })
    },

    getUserAddress:(userId)=>{
        return new Promise(async (resolve, reject)=>{
            let address= await db.get().collection(collection.USER_COLLECTION).findOne({_id:objectId(userId)})
            resolve(address)
            
        })
    },

    getPendingOrderProducts:(userId)=>{
        return new Promise(async (resolve, reject)=>{
            
          let  order=await db.get().collection(collection.ORDER_COLLECTION).find({$and: [  {userId:objectId(userId)},{status:"placed"}] }).toArray()
        
        resolve(order)
        })
    },

    getCancelledOrderProducts:(userId)=>{
        return new Promise(async (resolve, reject)=>{
            
          let  order=await db.get().collection(collection.ORDER_COLLECTION).find({$and: [  {userId:objectId(userId)},{status:"cancelled"}] }).toArray()
        
        resolve(order)
        })
    },

    
    getDeliveredOrderProducts:(userId)=>{
        return new Promise(async (resolve, reject)=>{
            
          let  order=await db.get().collection(collection.ORDER_COLLECTION).find({$and: [  {userId:objectId(userId)},{status:"delivered"}] }).toArray()
        
        resolve(order)
        })
    },

    getOrderDetails:(orderId)=>{
        return new Promise(async (resolve,reject)=>{
            let order=await db.get().collection(collection.ORDER_COLLECTION).findOne({orderId:orderId})
            resolve(order)
        })
        

    },

  


//     validateDiscoundCoupon:(cpCode)=>{
// return new Promise(async (resolve,reject)=>{
//     let code=await db.get().collection(collection.COUPON_COLLECTION).findOne({coupon:cpCode})
//     if(code){
//         resolve({coupon:true})
//     }
//     else{
//         resolve({coupon:false})
//     }
// })
//     },

    deleteuserCart:(userId)=>{
        return new Promise((resolve,reject)=>{
            db.get().collection(collection.CART_COLLECTION).deleteOne({user:objectId(userId)})
            resolve()
        })
 
    },

    addToCart:(userId,proId,weight,msg)=>{
   
        let proObj={
            item:objectId(proId),
            quantity:1,
            weight:weight,
            message:msg
        }
        return new Promise(async(resolve,reject)=>{

            let userCart=await db.get().collection(collection.CART_COLLECTION).findOne({user:objectId(userId)})

            db.get().col
            if(userCart){
                
                    let proExist=userCart.product.findIndex(product=> product.item==proId)
                   
                    if(proExist!=-1){
                        db.get().collection(collection.CART_COLLECTION)
                        .updateOne({user:objectId(userId),'product.item':objectId(proId)},
                        {
                            $inc:{'product.$.quantity':1}
                        }
                        ).then(()=>{
                            resolve()
                            
                        })
                    }else{
                db.get().collection(collection.CART_COLLECTION).updateOne({user:objectId(userId)},
                {
                   
                        $push:{product:proObj}
                    
                }).then((response)=>{
                    resolve()
                })
            }
            }  
            else{
                cartObj={
                    user:objectId(userId),
                    product:[proObj]
                }
    
                db.get().collection(collection.CART_COLLECTION).insertOne(cartObj).then((result)=>{
                    resolve()
                })
            }
        })

    },
      
    verifyCart:(proId,uid)=>{    
        return new Promise(async(resolve,reject)=>{
            let cart=await db.get().collection(collection.CART_COLLECTION).findOne({user:objectId(uid)})
            if(cart){
                let proExist=cart.product.findIndex(product=> product.item==proId.id)
         
                if(proExist!=-1){
                    resolve({status:true})
                }
                else{
                    resolve({status:false})
                }
               
            }else{
                resolve({status:false})
            }
        })
    },



    PlaceOrder:(order,product,total)=>{
        return new Promise((resolve,reject)=>{
          
            let status=order['payment-method']==='COD'?'placed':'pending'

            //order id generation
            let td=(new Date()).getDate()
let tm=(new Date()).getMonth()+1
let yr=(new Date()).getFullYear()
 yr = String(yr).slice(-2)
let num=Math.floor(1000 + Math.random() * 9000);
let Orderid=num+''+td+''+tm+''+yr
Orderid = Number(Orderid);
           let nwdate=new Date()
            var date= moment(nwdate).format('MMM Do YYYY');
            var time= moment(nwdate).format('LT')
            let orderObj={
                deliveryDetails:{
                    name:order.name,
                    mobile:order.mobnum,
                    address:order.permanentaddress,
                    pincode:order.pincode,
                    city:order.city,
                    state:order.state,
                    altNum:order.altNum,
                    expectedDate:order.expectedDate,
                    place:order.place,
                    landmark:order.landmark,
                    deliveryTime:order.deliveryTime,


                },
                orderId:Orderid,
                userId:objectId(order.userId),
                paymentMethod:order['payment-method'],
                product:product,
                totalAmount:total,
                coupon: order.coupon,
  deliveryCharge: order.deliveryCharge,
  ProductTotal: order.ProductTotal,
  totalwithoutdelivery: order.totalwithoutdelivery,
                date:date,
                
                year:moment(nwdate).format('YYYY'),
                month:moment(nwdate).format('MMM'),
                time:time,
                status:status
            }
            db.get().collection(collection.ORDER_COLLECTION).insertOne(orderObj).then((response)=>{
              
                resolve(Orderid)
            })
        })
    },

  deleteOrder:(orderId)=>{
 return new Promise((resolve,reject)=>{
        db.get().collection(collection.ORDER_COLLECTION).deleteOne({orderId:orderId}).then((response)=>{
            resolve(response)
        })
 })
  },


    generateRazorPay:(orderId,price,user)=>{
        return new Promise((resolve,reject)=>{
            
            instance.orders.create({ 
                 amount: price*100 , 
                 currency: "INR",
                 receipt: ""+orderId,  
                 notes: {    key1: "value3",    key2: "value2"  }},(err,order)=>{
                    
                     if(err){
                         reject(err)
                     }else{
                        console.log("order"+order);
                         order.user=user
                    resolve(order)
                     }
                 })
        })
    },
    
verifyPayment:(details)=>{
    return new Promise((resolve,reject)=>{
        console.log(details);
        let pid=details['payment[razorpay_payment_id]'];
        // let oid=details.response.razorpay_order_id
        // let sid=details.response.razorpay_signature

        console.log("hehehehhehehehehe");
        console.log(process.env.RAZORPAY_KEY_VERIFY);
        const crypto = require('crypto');
        let hmac = crypto.createHmac('sha256', process.env.RAZORPAY_KEY_VERIFY);
        hmac.update(details['payment[razorpay_order_id]']+'|'+details['payment[razorpay_payment_id]']);
        hmac=hmac.digest('hex')
        if(hmac==details['payment[razorpay_signature]']){
            console.log("payment success");
            console.log("pid"+pid);
            resolve(pid)
        }else{
            console.log("payment failed");
            reject()
        }
    })
},
changePaymentStatus:(orderId,pid)=>{
    return new Promise((resolve,reject)=>{
        db.get().collection(collection.ORDER_COLLECTION).updateOne({orderId:orderId},
        {
            $set:{
                status:'placed',
                 paymentId:pid

            }
        }).then(()=>{
            resolve()
        }).catch(()=>{
            reject()
        })
    })
},
getCouponDetails:(couponId)=>{
    return new Promise((resolve,reject)=>{
       
       db.get().collection(collection.COUPON_COLLECTION).findOne({Code:couponId}).then((coupon)=>{
           
             resolve(coupon)
    })
  
}

    )},

    addSubscription:(subEmail)=>{
        return new Promise((resolve,reject)=>{
            db.get().collection(collection.SUBSCRIPTION_COLLECTION).insertOne(subEmail).then(()=>{
                resolve()
            })
       
        })
    
    },
    getUserByEmail:(email)=>{
        return new Promise((resolve,reject)=>{
            db.get().collection(collection.USER_COLLECTION).findOne({Email:email}).then((user)=>{
                resolve(user)
            })  
        })
    },
    



}

