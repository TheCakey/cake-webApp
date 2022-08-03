var db=require('../config/connection')
var collection=require('../config/collection')
const { response } = require('../app')
const bcrypt=require('bcrypt')
const objectId=require('mongodb').ObjectId

module.exports={


    registerUser:(userData)=>{
        return new Promise(async(resolve,reject)=>{
        userData.Psw=await bcrypt.hash(userData.psw,10)
        db.get().collection(collection.USER_COLLECTION).insertOne(userData).then
            resolve(userData)
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
    db.get().collection(collection.USER_COLLECTION).updateOne({_id:objectId(id)},{$set: {fullname:userData.fullname,permanentaddress:userData.permanentaddress,pincode:userData.pincode,altNum:userData.altNum }}).then(async ()=>{
        user= await db.get().collection(collection.USER_COLLECTION).findOne({_id:objectId(id)})
        console.log(user);
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
            console.log("hlooooooooooooooooooooooooiiiiiiiiiiiiiiiiiiiiiiiiiiiiiii");
            let userCart=await db.get().collection(collection.CART_COLLECTION).findOne({user:objectId(userId)})
            if(userCart){
                
                    let proExist=userCart.product.findIndex(product=> product.item==proId)
                    console.log('prooooooooooooo exist')
                    console.log(proExist);
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
                        quantity:'$product.quantity'
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
                       item:1,quantity:1,product:{$arrayElemAt:['$product',0]}
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
                        quantity:'$product.quantity'
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
                       item:1,quantity:1,product:{$arrayElemAt:['$product',0]}
                    }
                },
                {
                    
                    $group:{
                        _id:null,
                        
                        total:{$sum:{$multiply: ['$quantity', {$toInt: '$product.Price'}]}}
                    }
                }

            ]).toArray()
          
            resolve(total[0].total)
           
        })
    },

}

