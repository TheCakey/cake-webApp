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
    }


}