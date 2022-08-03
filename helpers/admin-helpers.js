var db=require('../config/connection')
var collection=require('../config/collection')
const { response } = require('../app')
const bcrypt=require('bcrypt')

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





}