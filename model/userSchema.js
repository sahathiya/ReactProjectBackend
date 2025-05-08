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
       
      },
   
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