
const mongoose=require('mongoose')
const productSchema=new mongoose.Schema({
    
    _id:{type:mongoose.Schema.Types.ObjectId,auto:true},
    name:{type:String,required: true},
    category:{type:String,required: true},
    image:{type:String,required: true},
    price:{type:Number,required: true},
    offerprice:{type:Number},
    qty:{type:Number,required: true},
    description:{type:String,required: true},
    brand:{type:String,required: true},
    rating:{type:Number,required: true},
    reviews:{type:Number,required: true}


})

module.exports=mongoose.model('Products',productSchema)