const jwt=require('jsonwebtoken')
const customError=require('../../utils/customError')

const Refreshtoken=async(req,res,next)=>{
    
        const Refreshtoken=req.cookies.Refreshtoken
        console.log(Refreshtoken);
        if(!Refreshtoken){
            return res.status(404).send('refresh token is missing')
        }
        jwt.verify(Refreshtoken,process.env.JWT_KEY,(err,user)=>{
            if(err){
               return next (new customError('Invalid refresh token, please log in again',400))
            }


            const accessToken=jwt.sign(
                {id:user.id,username:user.username,email:user.email},
                process.env.JWT_KEY,
                { expiresIn: "30m" } 
            )
            res.cookie('token', accessToken, {
                httpOnly: true,    
                secure: true,      
                maxAge:  30 * 60 * 1000,
                sameSite: 'lax',   
            });
            
            res.status(200).json({ accessToken: accessToken });
                    
                })
        }
    





module.exports={Refreshtoken}