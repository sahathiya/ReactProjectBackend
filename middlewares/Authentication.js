const jwt=require("jsonwebtoken");

const userAuthMiddleware = async (req, res, next) => {
    try {
      
      const token=req.cookies.token
      console.log(token)
     if(!token){
      return res.status(401).send("Authentication token missing");
     }
        
        if (token) {
          jwt.verify(token, process.env.JWT_KEY, (err, user) => {
            
            if(err){
                res.send(err)
            }else{
                req.user=user
                console.log(req.user);
                
                next()
            }
          });
        } else {
        
        res.status(404).send("not authenticate")
        }
      } catch (error) {
      
        res.send(error)
      }
    };
    

    const adminAuthMiddleware = (req, res, next) => {



      const Admintoken=req.cookies.Admintoken
      console.log("fgdsgshf",Admintoken);
      if(!Admintoken){
        return res.status(401).send("Authentication admintoken missing");
      }
      if (Admintoken) {
        jwt.verify(Admintoken, process.env.JWT_SECRET, (err, user) => {
          
          if(err){
              res.send(err)
          }else{
              req.user=user
              console.log(req.user);
              
              next()
          }
        });
      }else{
        res.status(404).send("not authenticate admin")
      }
    };


module.exports={userAuthMiddleware,adminAuthMiddleware}