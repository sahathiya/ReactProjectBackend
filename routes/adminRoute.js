const express=require('express')
const routes=express.Router()
const upload=require('../middlewares/ImageUpload')
const{adminAuthMiddleware}=require('../middlewares/Authentication')
const adminUser=require('../controller/Admin/userController')
const adminProduct =require('../controller/Admin/productController')
const adminOrder=require('../controller/Admin/ordercontroller')
const{adminRefreshtoken}=require('../controller/Admin/adminRefresh')
const tryCatch=require('../utils/tryCatch')

const user = require('../controller/users')
//admin routes
routes
.get('/all',tryCatch(adminUser.AllUsers))
.get('/user/:id',adminAuthMiddleware,tryCatch(adminUser.userById))
.delete('/removeuser/:id',adminAuthMiddleware,tryCatch(adminUser.removeUser))
.post('/block/:id',adminAuthMiddleware,tryCatch(adminUser.blockUser))

//admin refreshtoken
.post('/refresh',tryCatch(adminRefreshtoken))

//product routes
.get('/products',adminAuthMiddleware,tryCatch(adminProduct.getAllProducts))
.get('/productbyId/:id',adminAuthMiddleware,tryCatch(adminProduct.getProductsId))
.get('/productbyCategory/:category',adminAuthMiddleware,tryCatch(adminProduct.getProductsCategory))
.post('/newproduct',upload.single('image'),adminAuthMiddleware,tryCatch(adminProduct.addProducts))
.delete('/remove/:id',tryCatch(adminProduct.deleteProduct))
.patch('/update/:id',upload.single('image'),adminAuthMiddleware,tryCatch(adminProduct.updateProduct))


//orders routes

.get('/orders',adminAuthMiddleware,tryCatch(adminOrder.allOrders))
.get('/userorder/:id',adminAuthMiddleware,tryCatch(adminOrder.OrderByUserId))
.get('/totalp',adminAuthMiddleware,tryCatch(adminOrder.totalProducts))
.get('/revenue',adminAuthMiddleware,tryCatch(adminOrder.totalRevenue))
.get('/daily',adminAuthMiddleware,tryCatch(adminOrder.dailyRevenue))
.get('/dailyandtotal',adminAuthMiddleware,tryCatch(adminOrder.getDailyAndTotalRevenue))
.get('/totalorder',adminAuthMiddleware,tryCatch(adminOrder.totalOrders))

//admin logout
.post('/adminlogout',adminAuthMiddleware,tryCatch(user.adminLogout))
 module.exports=routes