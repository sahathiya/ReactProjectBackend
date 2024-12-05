const Wishlist = require('../../model/wishlistSchema')

const customError=require('../../utils/customError')

//add a product to wishlist of current user
const addProductToWishlist = async (req, res) => {

    const { productId } = req.body;
    let wishlist = await Wishlist.findOne({ user: req.user.id });

    if (!wishlist) {
        const newWishlist = new Wishlist({
            user: req.user.id,
            products: [productId]
        });

        await newWishlist.save();

        const populatedWishlist = await newWishlist.populate('products');
        return res.status(200).json({ status: 'success', message: 'wishlist created', populatedWishlist });
    }
    const isProductInWishlist = wishlist.products.some(product => product.equals(productId));
    console.log('cgjds', isProductInWishlist);


    if (!isProductInWishlist) {

        wishlist.products.push(productId);
        await wishlist.save();
        wishlist = await wishlist.populate('products');
        return res.status(200).json({ status: 'success', message: 'product added to wishlist', wishlist });
    }

    res.status(200).json({ status: 'success', message: 'Product already added to wishlist' });
}




//get all wishlist products
const wishlistProducts = async (req, res) => {

    const wishlist = await Wishlist.findOne({ user: req.user.id }).populate('products')
    if (!wishlist) {
        const newwishlist = new Wishlist({
            user: req.user.id,
            products: []
        })
        await newwishlist.save()
        return res.status(201).json({ status: 'success', message: 'wishlist created', newwishlist })
    }

    return res.status(200).json({ status: 'success', message: 'wishlist found', wishlist })
}



//remove a product from wishlist
const removeWishlist = async (req, res,next) => {
    const { productId } = req.body;
    const data = await Wishlist.findOne({ user: req.user.id }).populate('products')
    console.log(data);

    if (!data) {
        return next (new customError('wishlist not found',404))
    }
    const productindex = data.products.findIndex(pro => pro._id.toString() == productId.toString())
    if (productindex === -1) {
        return res.status(404).json({ status: 'fail', message: 'item not found in wishlist' });
    }
    data.products.splice(productindex, 1)
    await data.save()
    res.status(200).json({ status: 'success', message: 'wishlist removed successfully', data })
}




module.exports = { addProductToWishlist, wishlistProducts, removeWishlist }


