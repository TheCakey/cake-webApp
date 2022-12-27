const mongoClient=require ('mongodb').MongoClient
const state={
    db:null
}
module.exports.connect=(done)=>{
    const url='mongodb+srv://thecakey:'+process.env.DB_PASS+'@cluster0.4ohp2pm.mongodb.net'
    const dbname='thecakey'

    mongoClient.connect(url,(err,data)=>{
        if(err) return done (err)
        state.db=data.db(dbname)
        
        done()
    })

 
}



module.exports.get=function(){
    return state.db
}