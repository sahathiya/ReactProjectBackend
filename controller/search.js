
const Products=require('../model/productSchema')
const searchcontroller = async (req,res,next) =>{
    const query = req.query.q; 
    console.log("query",query);
    
    if (!query) {
      return res.status(400).json({ message: "Search query is required" });
    }

    
    const products = await Products.find({
      name: { $regex: query, $options: "i" }, 
    });

    res.json(products);


}

module.exports={
searchcontroller
}