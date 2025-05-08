const Users=require('../model/userSchema')
const {joiUserSchema,joiLoginSchema}=require('../model/joivalidation')
const jwt=require('jsonwebtoken')
const bcrypt=require('bcrypt')
const customError=require('../utils/customError')


const getusers=async (req,res,next)=>{
    
       const users= await Users.find()


       if(!users){
        return next(new customError('users not found',404))
       }
       res.status(200).json({status:'success',message:'users found',users})
    }
    const getusersbyId=async (req,res,next)=>{
    
        const users= await Users.find({user:req.params.id})
 
 
        if(!users){
         return next(new customError('user with this id not found',404))
        }
        res.status(200).json({status:'success',message:'user found',users})
     }
//user Registration
const createusers= async (req,res,next)=>{
  
        const {value,error}=joiUserSchema.validate(req.body)
        const {username,email,password,cpassword}=value
        if(error){
            return next(new customError('error occured in validation',400))
          
        }
        if(password!==cpassword){
          return  res.status(404).json({error:'password do not match'})
        }
        const exstingemail= await Users.findOne({email})
        if (exstingemail) {
            return res.status(400).json({message: ` The${exstingemail.email} is already existing`})
        }

        const hashedPassword=await bcrypt.hash(password,8)
        const users=new Users({username,email,password:hashedPassword})
        console.log("uuuuuu",users);
        
        await users.save()
        res.status(201).json({status:'success',message:'welcome user',users})
    
   
}


//user login

const userLogin=async(req,res,next)=>{
    
        const{value,error}=joiLoginSchema.validate(req.body)
        if(error){
         
          return next(new customError('error occured in validation',400))
        }
        const{username,password}=value

       const user=await Users.findOne({username})
        console.log(user);
        if(!user){
            return  res.status(404).json({message:'user not found'})
        }
        
        const matching=await bcrypt.compare(password,user.password)
        if(!matching){
            console.log(password);
            
           return res.status(400).json({message:'password do not match'})
        }
       


        const isBlock=user.block
        if(isBlock){
          return   res.status(400).json({message:' you  are blocked by admin'})
        }
        
        console.log(user.admin);
         //admin login with jwt
       if(user.admin){
       const Admintoken=jwt.sign({id:user._id,admin:true},process.env.JWT_SECRET,{expiresIn:'1hr'})
       console.log(Admintoken);
       
        const AdminRefreshtoken=jwt.sign({id:user._id,admin:true},process.env.JWT_SECRET,{expiresIn:'7d'})
        res.cookie('Admintoken',Admintoken,{
            httpOnly:true,
            secure:true,
            sameSite:'lax',
            maxAge:60*60*60*1000
    
        })
    
    
    
        res.cookie('AdminRefreshtoken',AdminRefreshtoken,{
            httpOnly:true,
            secure:true,
            sameSite:'lax',
            maxAge:7*24*60*60*1000
    
        })

        
       
        
        
       return  res.status(200).json({status:'success', message:'admin logged successfully',user})
       }else{
         //user login and JWT
        const token = jwt.sign({ id: user._id, username: user.username, email: user.email },process.env.JWT_KEY, { expiresIn: '1d' })
       
          const Refreshtoken = jwt.sign({ id: user._id, username: user.username, email: user.email },process.env.JWT_KEY, { expiresIn: '7d' })
      
        res.cookie("token", token, {
            httpOnly: false, 
            secure: true, 
            sameSite: "lax", 
            maxAge: 24 *60 *60 *1000 
        });
        
        res.cookie("Refreshtoken", Refreshtoken, {
            httpOnly: false,
            secure: true,
            sameSite: "lax",
            maxAge: 7 *24 *60 *60 *1000 
        })

       
        res.status(200).json({status:'success',message:'user login succeessfully completed',user})
       }
        
    
}
//user logout
const userLogout=async(req,res)=>{
    try {
        res.clearCookie('token', {
            httpOnly: true,
            secure: true,
            sameSite: 'none',
        });
        res.clearCookie('Refreshtoken', {
            httpOnly: true,
            secure: true,
            sameSite: 'none',
        });
       
        res.status(200).json({ status: 'success', message: 'Logout successful' })
    } catch (error) {
        res.status(404).send('logout failed')
    }
}


const adminLogout=async(req,res)=>{

    try {
        res.clearCookie('Admintoken', {
            httpOnly: true,
            secure: true,
            sameSite: 'none',
        });

        res.clearCookie('AdminRefreshtoken', {
            httpOnly: true,
            secure: true,
            sameSite: 'none',
        });

       
        res.status(200).json({ status: 'success', message: ' admin Logout successful' })
    } catch (error) {
        res.status(404).send(' admin logout failed')
    }

}

module.exports={getusers,createusers,userLogin,userLogout,adminLogout,getusersbyId}