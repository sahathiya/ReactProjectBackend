const mongoose=require('mongoose')

const userSchema=new mongoose.Schema({
    username:{type: String,
        required: true,
        
       
    },
    email:{type: String,
        required: true,
        unique: true,
        match: [/\S+@\S+\.\S+/, 'Email is invalid'],
    },
    password: {
        type: String,
        required: true,
        // minlength: 8,
      },
    // address: {
    //     type: String,
    //     required: true,
    //   },
    //   phonenumber: {
    //     type: Number,
    //     unique: true,
    //     required: true,
    //     // match: [/^\d{10}$/, 'Phone number should be 10 digits'],
    //   },
    admin: {
        type: Boolean,
        default: false,
      },
      block: {
        type: Boolean,
        default: false,
      }, 
   

})







module.exports=mongoose.model('Users',userSchema)