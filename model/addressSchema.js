
const mongoose =require('mongoose')




const addressSchema=new mongoose.Schema({
  user:{type:mongoose.Schema.Types.ObjectId ,ref:'Users'},
       Name: {
        type: String,
        required: true,
      },
      phoneNumber: {
        type: Number,
        required: true,
      },
      alternatePhoneNumber: {
        type: Number,
        required: false,
      },
      pincode: {
        type: Number,
        required: true,
      },
      state: {
        type: String,
        required: true,
      },
      city: {
        type: String,
        required: true,
      },
      buildingName: {
        type: String,
        required: true,
      },
      roadAreaColony: {
        type: String,
        required: true,
      },
      landmark: {
        type: String,
        required: false,
      },
})

module.exports=mongoose.model('Address',addressSchema)