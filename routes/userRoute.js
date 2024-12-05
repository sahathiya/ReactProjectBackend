const express=require('express')
const routes=express.Router()
const{userAuthMiddleware}=require('../middlewares/Authentication')
const{Refreshtoken}=require('../controller/User/Refreshtoken')
const user = require('../controller/users')
const order=require('../controller/User/orders')
const product=require('../controller/User/products')
const cart = require('../controller/User/cart')
const wishlist=require('../controller/User/wishlist')
const address=require('../controller/User/address')
const tryCatch=require('../utils/tryCatch')
const search=require('../controller/search')
//users signup/login/logout
routes
.get('/users',tryCatch(user.getusers))
.get('/users/:id',tryCatch(user.getusersbyId))
.post('/signup',tryCatch(user.createusers))
.post('/login',tryCatch(user.userLogin))
.post('/logout',tryCatch(user.userLogout))

//product view

.get('/allproducts',tryCatch(product.getAllProducts))
.get('/productsby/:id',tryCatch(product.getProductsId))
.get('/products/:category',tryCatch(product.getProductsCategory))


//cart

.post('/cart', userAuthMiddleware,tryCatch(cart.addTocart))
.get('/cartproducts',userAuthMiddleware,tryCatch(cart.getallCartItems))
.delete('/removecart',userAuthMiddleware,tryCatch(cart.removeCarItems))
.put('/updatecart',userAuthMiddleware,tryCatch(cart.updateCart))
.delete('/clearcart',userAuthMiddleware,tryCatch(cart.clearCart))



//wishlist
.post('/wishlist',userAuthMiddleware,tryCatch(wishlist.addProductToWishlist))
.get('/wishlistpage',userAuthMiddleware,tryCatch(wishlist.wishlistProducts))
.delete('/removewishlist',userAuthMiddleware,tryCatch(wishlist.removeWishlist))



//refreshtoken
.post('/refreshtoken',tryCatch(Refreshtoken))




//orders
.post('/order',userAuthMiddleware,tryCatch(order.createOrder))
.get('/allorders',userAuthMiddleware,tryCatch(order.getAllOrders))
.delete('/removeorder/:id',userAuthMiddleware,tryCatch(order.cancelOrder))
.post('/verify',userAuthMiddleware,tryCatch(order.verifyOrder))



//address

.post('/address',userAuthMiddleware,tryCatch(address.createAddress))
.get('/alldata',userAuthMiddleware,tryCatch(address.getAddress))


//user
.post('/search',tryCatch(search.searchcontroller))
module.exports=routes
