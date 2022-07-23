var db=require('../config/connection')
var collection=require('../config/collection')
const { response } = require('../app')
const bcrypt=require('bcrypt')


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
    }
}