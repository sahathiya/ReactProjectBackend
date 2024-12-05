

const Address=require('../../model/addressSchema')
const CustomError=require('../../utils/customError')
const {joiAddressSchema}=require('../../model/joivalidation')


const createAddress=async(req,res,next)=>{
    const{error,value}=joiAddressSchema.validate(req.body)
    const user=req.user.id
    const{Name,phoneNumber,alternatePhoneNumber,pincode,state,city,buildingName,roadAreaColony,landmark}=value
    if(error){
        return res.status(400).json({
            status: "error",
            message: error.details[0].message,
          });
    }
    const newAddress = new Address({user,Name,phoneNumber,alternatePhoneNumber,pincode,state,city,buildingName,roadAreaColony,landmark});
    await newAddress.save();
    console.log("hel",newAddress);
    const populateuser=await newAddress.populate("user")
    res.status(200).json({
      status: "success",
      message: "Delivery address created",
       newAddress,
    });


  if(!newAddress)  {
  return   next(new CustomError('failed to create address',404))
  }
   
    


}


const getAddress=async(req,res,next)=>{
  const address=await Address.find()
  if(!address){
    return next(new CustomError('address not found',404))
  }

  return res.status(200).json({status:'success',message:'get all address',address})
}



const getAddressbyId=async(req,res,next)=>{
  const address=await Address.findOne(req.params.id)
  if(!address){
    return next(new CustomError('address with this id not found',404))
  }

  return res.status(200).json({status:'success',message:'get all address',address})
}

module.exports={getAddress,createAddress,getAddressbyId}