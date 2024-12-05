
const Products=require('../../model/productSchema')
const customError=require('../../utils/customError')


const getAllProducts=async(req,res,next)=>{
    
       const result= await Products.find()
       console.log(result);
      
       
       if(!result){
         return next( customError("product not found",404))
       }
        res.status(200).json({ status:'success',message:'all products',result})
    
   
   }





const getProductsId=async(req,res,next)=>{
    
        const productid=req.params.id
    const products= await Products.findById(productid)
    if(!products){
        
        return next( customError("product  with this id  is not found",404))
    }
    res.status(200).send(products)
   
    
}


const getProductsCategory=async(req,res,next)=>{
    
        
    const products=await Products.find({ category: req.params.category })
    if(!products){
       return next( new customError('product not found',404))
    }
    res.status(200).json({status:'success',message:'products by category',products})
        
    
    
}
module.exports={getAllProducts,getProductsId,getProductsCategory}