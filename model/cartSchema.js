const mongoose=require('mongoose')
const cartSchema=new mongoose.Schema({
    user:{type:mongoose.Schema.Types.ObjectId ,ref:'Users'},
    products:[{
        productId:{type:mongoose.Schema.Types.ObjectId,ref :'Products'},
        quantity:{type:Number,default:1,required:true}
    }]

})

module.exports=mongoose.model('Cart',cartSchema)