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
                    Subcategory:ProDetails.Subcategory,
                    Price:ProDetails.Price,
                    Category:ProDetails.Category,
                    EstimateDelivery:ProDetails.EstimateDelivery,
                    ProductDescription:ProductDetails.ProductDescription,
                    Type:ProDetails.Type
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