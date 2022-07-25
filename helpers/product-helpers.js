var db=require('../config/connection')
var collection=require('../config/collection')
var objectId=require('mongodb').ObjectID

module.exports={
  
    addProduct:(product,callback)=>{
        console.log('kkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkk')
        db.get().collection(collection.PRODUCT_COLLECTION).insertOne(product).then((data)=>{
            console.log(data.insertedId);
            callback(data.insertedId)

        })
    },

    getProductCake:()=>{
        return new Promise(async (resolve,reject)=>{
            let products= await db.get().collection(collection.PRODUCT_COLLECTION).find({Category:"Cream"}).toArray()
            console.log(products);
            resolve(products)

        })
    },



}