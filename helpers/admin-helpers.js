var db=require('../config/connection')
var collection=require('../config/collection')
const bcrypt=require('bcrypt')

module.exports={
    

     doLogin:(userData)=>{
        console.log('kkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkk')
         console.log(userData)
        
        return new Promise(async (resolve,reject)=>{
            let loginStatus=false
            let response={}
            let user=await db.get().collection(collection.ADMIN_COLLECTION).findOne({Email:userData.Email})
            
            if(user){
                bcrypt.compare(userData.Password,user.Password).then((status)=>{
                    if(status){
                        console.log("login success");
                        response.user=user
                        response.status=true
                        console.log(response);
                        resolve(response)
                    }else{
                        console.log('login failed');
                        resolve({status:false,error:"Password Does Not Match"})
                    }
                })
            }else{
                console.log('login failed');
                resolve({status:false,error:'Email Does Not Exist'})
            }
            

        })
    },





}