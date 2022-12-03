var db=require('../config/connection')
var collection=require('../config/collection')
var objectId=require('mongodb').ObjectID

module.exports={
  
    addProduct:(product,callback)=>{
      
        db.get().collection(collection.PRODUCT_COLLECTION).insertOne(product).then((data)=>{
           
            callback(data.insertedId)
            

        })
    },

    searchProduct:(search)=>{
        return new Promise(async(resolve,reject)=>{
        var search=new RegExp(search,'i')
        db.get().collection(collection.PRODUCT_COLLECTION).find({$or:[{name:search},{category:search}]}).toArray().then((data)=>{
           resolve(data)
        })
    })
    },

    getProductCake:()=>{
        return new Promise(async (resolve,reject)=>{
            let products= await db.get().collection(collection.PRODUCT_COLLECTION).find().toArray()
           
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
                    flavour:ProDetails.flavour,
                    kgstatus:ProDetails.kgstatus,
                    defaultweight:ProDetails.defaultweight,
                }
                

            }).then((response)=>{
               
                resolve()
            }).catch((err)=>{

                console.log(err);
                reject()
            })
        })
    },

    deleteProduct:(proId)=>{
        return new Promise(async(resolve,reject)=>{
            db.get().collection(collection.PRODUCT_COLLECTION).deleteOne({_id:objectId(proId)})
            resolve()
        })
    },



    getSingleProduct:(productId)=>{
        return new Promise(async(resolve,reject)=>{
           let product = await db.get().collection(collection.PRODUCT_COLLECTION).findOne({_id:objectId(productId)})
           resolve(product)
        })
    },

   


    searchProduct:(searchs)=>{
        return new Promise(async(resolve,reject)=>{
        var search=new RegExp(searchs,'i')
        db.get().collection(collection.PRODUCT_COLLECTION).find({$or:[{Name:search},{Category:search}]}).toArray().then((data)=>{
            console.log(data);
           resolve(data)
        })
    })
    }


}