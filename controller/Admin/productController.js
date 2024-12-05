
const Products = require('../../model/productSchema')
const { joiProductSchema } = require('../../model/joivalidation')
const Cart = require('../../model/cartSchema')
const customError = require('../../utils/customError')
// view all products
const getAllProducts = async (req, res, next) => {


    const result = await Products.find()
    console.log(result.length);

    console.log(result);


    if (!result) {
        return next(new customError("product not found", 404))

    }
    res.status(200).json({ status: 'success', message: 'get all products', result })


}



//view products specifically

const getProductsId = async (req, res) => {

    const productid = req.params.id
    const products = await Products.findById(productid)
    if (!products) {
        res.send('product not found')
    }
    res.status(200).json({ status: 'success', message: 'products by id', products })


}


//view product by category

const getProductsCategory = async (req, res, next) => {


    const products = await Products.find({ category: req.params.category })
    if (!products) {
        return next(new customError('product not found', 404))
    }
    return res.status(200).json({ status: 'success', message: 'products by category', products })



}



//to add products
const addProducts = async (req, res, next) => {
    const { value, error } = joiProductSchema.validate(req.body)
    console.log("req",req.body);
    
    if (error) {
        return next(new customError('error found in validation', error.details[0].message, 404))
    }


    const { name, category, price, qty, description, brand, rating, reviews } = value

    const exstingProduct= await Products.findOne({name})
    if (exstingProduct) {
        return res.status(400).json({ 
            status: "fail", 
            message: `The product "${exstingProduct.name}" already exists.` 
        });
    }
    




    // console.log("image");
    // const { name, category, price, qty, description, brand, rating, reviews } = value
    
    const image = req.file?.path
    console.log("image",image);
    
    const newproduct = new Products({ name, category, image, price, qty, description, brand, rating, reviews })
    await newproduct.save()
    res.status(201).json({ status: 'success', message: 'new product added', newproduct })

}


//to delete a product
const deleteProduct = async (req, res) => {
    const product = await Products.findByIdAndDelete(req.params.id)
    if (!product) {

        return next(new customError('product with this id not found ', 404))
    }

    await Cart.updateMany(
        { 'products.productId': req.params.id },
        { $pull: { products: { productId: req.params.id } } }
    )

    res.status(200).json({ status: 'success', message: 'product successfully deleted' })
}


//to update product

const updateProduct = async (req, res,next) => {
    
    const { error, value } = joiProductSchema.validate(req.body);
    console.log(value);

    if (error) {
        console.error("Validation Error:", error.details);

        return next(new customError('error found in validation', error.details[0].message, 404))
    }

    if (req?.file) {
        console.log("Image file found:", req.file.path);
        value.image = req.file.path;
    }





    

    const updatedProduct = await Products.findByIdAndUpdate(req.params.id, value, { new: true });

    if (!updatedProduct) {
        return res.status(404).json({ status: 'failed', message: 'Product not found with this ID' })
    }

    res.status(200).json({ status: 'success',message:'product updated' , updatedProduct });


}

module.exports = { getAllProducts, getProductsId, getProductsCategory, addProducts, deleteProduct, updateProduct }