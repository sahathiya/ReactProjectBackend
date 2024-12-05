const mongoose =require('mongoose')

const orderShema=new mongoose.Schema({
    UserID:{type:mongoose.Schema.Types.ObjectId,ref:'Users'},
    products:[{
        productId:  {type:mongoose.Schema.Types.ObjectId,ref:'Products'},
        quantity:{type:Number,required:true,default:1}
    }],
      
    sessionID:{type:String},
    purchaseDate:{type:Date,default:Date.now},
    amount:{type:Number,required:true},
    paymentStatus:{type:String,enum:["pending",'completed',"cancelled"],default:'pending'},
    shippingStatus: { type: String,enum:["Processing","pending",'completed',"cancelled"] ,default: "pending" },

    address:{type:mongoose.Schema.Types.ObjectId,ref:'Address'}

})


module.exports=mongoose.model('Orders',orderShema)