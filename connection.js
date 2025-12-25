const mongoose=require('mongoose')

async function connectingToMongodb(url){
    return await mongoose.connect(url);
}





module.exports=connectingToMongodb;