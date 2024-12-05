const mongoose =require('mongoose')

const wishlistSchema=new mongoose.Schema({
    user:{type:mongoose.Schema.Types.ObjectId,ref:'Users'},
    products:[{type:mongoose.Schema.Types.ObjectId,ref:'Products'}]
})

module.exports=mongoose.model('Wishlist',wishlistSchema)