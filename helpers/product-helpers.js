var db=require('../config/connection')
var collection=require('../config/collection')
var objectId=require('mongodb').ObjectID

module.exports={
  
    addProduct:(product,callback)=>{
      
        db.get().collection(collection.PRODUCT_COLLECTION).insertOne(product).then((data)=>{
            console.log(data.insertedId);
            callback(data.insertedId)

        })
    },

    getProductCake:()=>{
        return new Promise(async (resolve,reject)=>{
            let products= await db.get().collection(collection.PRODUCT_COLLECTION).find({Category:"Cream"}).toArray()
           
            resolve(products)

        })
    },

    updateProduct:(ProDetails,proId)=>{
        return new Promise(async(resolve,reject)=>{
      
            db.get().collection(collection.PRODUCT_COLLECTION).updateOne({_id:objectId(proId)},{
                $set:{
                    Name:ProDetails.Name,
                    Price:ProDetails.Price,
                    Category:ProDetails.Category,
                    ProductDescription:ProDetails.ProductDescription,
                }
                

            }).then((response)=>{
               
                resolve()
            }).catch((err)=>{

                console.log(err);
                reject()
            })
        })
    },

    getSingleProduct:(productId)=>{
        return new Promise(async(resolve,reject)=>{
           let product = await db.get().collection(collection.PRODUCT_COLLECTION).findOne({_id:objectId(productId)})
           resolve(product)
        })
    },

    




}