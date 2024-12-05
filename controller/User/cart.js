
const Cart = require('../../model/cartSchema');
const CustomError = require('../../utils/customError')
const addTocart = async (req, res) => {
    const { productId } = req.body;
    console.log('productId.................',productId);
    


    let addProductTocart = await Cart.findOne({ user: req.user.id }).populate('products.productId')
    // console.log("cart found", addProductTocart);

    if (addProductTocart) {

        let existingProduct = addProductTocart.products.find((item) => item.productId._id == productId);
      console.log("existingProduct",addProductTocart);

        if (existingProduct) {

            return res.status(200).json({ status: 'success', message: 'product is already exists' })
        } else {

            addProductTocart.products.push({ productId: productId, quantity: 1 });
        }

        await addProductTocart.save();
        addProductTocart= await addProductTocart.populate("products.productId")

        return res.status(200).json({ status: 'success', message: 'product added to cart', addProductTocart });
    } else {

        const newCart = new Cart({
            user: req.user.id,
            products: [{ productId: productId, quantity: 1 }]
        });
        await newCart.save();

        const cartsend = await newCart.populate('products.productId');
        return res.status(201).json({ status: 'success', message: 'cart created with a product', cartsend });
    }

};


//to get all cartproducts

const getallCartItems = async (req, res) => {

    const allcartitems = await Cart.findOne({ user: req.user.id }).populate('products.productId')
    console.log('User ID:', req.user.id);
    
    if (!allcartitems) {

        return res.status(404).json({message:'no cart items'})
    }

    res.status(200).json({ status: 'success', message: 'cart items', allcartitems })
}




//remove a product from cart
const removeCarItems = async (req, res, next) => {
    const { productId } = req.body;
    console.log('productId:', {productId});

    const cartdata = await Cart.findOne({ user: req.user.id }).populate('products.productId');
    // console.log('cartdata:', cartdata);

    if (!cartdata) {
        return next(new CustomError('no cart data', 404));
    }

    const productIndex = cartdata.products.findIndex((item) => item.productId._id.toString() === productId.toString());
    // console.log("index:", productIndex);

    if (productIndex === -1) {
        return res.status(404).json({ status: 'fail', message: 'item not found in cart' });
    }

    cartdata.products.splice(productIndex, 1);
    await cartdata.save();
    res.status(200).json({ status: 'success', message: 'item removed', cartdata });
};


//update cart items

const updateCart = async (req, res,next) => {
    const { productId, action } = req.body
    console.log("productId, action ",productId, action )
    
    const cartdata = await Cart.findOne({ user: req.user.id }).populate('products.productId')
    console.log("cart",cartdata);

    if (!cartdata) {

        return next(new CustomError('you have no cart', 404))
    }

    const cartproduct = cartdata.products.find((item) => item.productId._id == productId)
    if (!cartproduct) {
        return next(new CustomError('no product', 404))

    }

    if (action === 'increment') {

        cartproduct.quantity += 1
    } else if (action === 'decrement') {
        if (cartproduct.quantity > 1) {
            cartproduct.quantity -= 1
        } else {
            cartdata.products = cartdata.products.filter((item) => item.productId._id.toString() !== productId)

            console.log('cartdata.products',cartdata.products);
            


        }

    } else {

        return next(new CustomError('invalid action', 404))
    }
    await cartdata.save()

    const updatecart = await Cart.findOne({ user: req.user.id }).populate('products.productId')

    res.status(200).json({ status: 'success', message: 'cart updated successfully', updatecart })

}


//clear all cart data after payment

const clearCart = async (req, res, next) => {
    const cart = await Cart.findOne({ user: req.user.id })
    if (!cart) {

        return next(new CustomError('cart not found', 400))
    }

    cart.products = []
    await cart.save()
    res.status(200).json({ status: 'success', message: 'cart cleared successfully', cart })

}
module.exports = { addTocart, getallCartItems, removeCarItems, updateCart, clearCart };
