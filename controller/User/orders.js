const Order = require('../../model/orderSchema');
const Cart = require('../../model/cartSchema'); 
const Address=require('../../model/addressSchema')
const { v4: uuidv4 } = require('uuid');
const CustomError = require('../../utils/customError')
const stripe = require("stripe")

//order



const createOrder = async (req, res,next) => {
    





    const userCart = await Cart.findOne({ user: req.user.id }).populate("products.productId");
    const useraddress=await Address.findOne({user:req.user.id}).sort({ _id: -1 })
    if (!userCart) {
        return next(new CustomError('User cart not found', 404))
    }

    const totalPrice = Math.round(

        userCart.products.reduce((total, item) => {
            const price = parseFloat(item.productId.price);
            const quantity = parseInt(item.quantity);
            if (isNaN(price) || isNaN(quantity)) {
                return next( new CustomError('Invalid product price or quantity'))
            }

            return total + price * quantity;
        }, 0)
    )
   

    const lineItems = userCart.products.map(item => ({
        price_data: {
            currency: 'INR',
            product_data: {
                name: item.productId.name,
                images: [item.productId.image]
            },
            unit_amount: Math.round(item.productId.price * 100) 
        },
        quantity: item.quantity
    }));
    console.log("line",lineItems);
    

    const stripeclint=new stripe(process.env.STRIPE_KEY)
    const session = await stripeclint.checkout.sessions.create({
        payment_method_types: ['card'],  
        line_items: lineItems,           
        mode: 'payment',
        ui_mode:'embedded',
        return_url: `${process.env.URL_FRONTEND}/my-orders/{CHECKOUT_SESSION_ID}`,
       
    });


    const newOrder = new Order({
        UserID: req.user.id,
        address:useraddress,
        products: userCart.products,
        sessionID:session.id,
        amount: totalPrice,
        paymentStatus:'pending',
        
    });


    const savedOrder = await newOrder.save();
    await Cart.findOneAndUpdate({ user: req.user.id }, { $set: { products: [] } });

    res.status(200).json({
        message:'order created succesfully',
        data:{
            session:session,
            order:savedOrder,
            clientsecret: session.client_secret,
            linedata:lineItems
        }
    });


}



//get all orders

const getAllOrders = async (req, res) => {
    try {
      const allorders = await Order.find({ UserID: req.user.id })
        .populate('products.productId')
        .populate('UserID')
        .populate('address');
      
      if (!allorders || allorders.length === 0) {
        return res.status(404).json({ message: 'No orders found' });
      }
      
      res.status(200).send({
        status: 'success',
        message: 'All orders of user',
        allorders,
      });
    } catch (error) {
      console.error('Error fetching orders:', error.message);
      res.status(500).json({ message: 'Server error' });
    }
  };
  


//verify order
const verifyOrder=async(req,res)=>{

const{sessionID}=req.body



    const order = await Order.findOne({ sessionID:sessionID});

    if (!order) {
        return res.status(404).json({message:'no orders found'})
    }                                

    if (order.paymentStatus === 'completed') {
        return res.status(400).json({  status:'',message:'order already verified'});
    }

    order.paymentStatus = 'completed';
    order.shippingStatus = 'Processing';
    const updatedOrder = await order.save();    

    res.status(200).json({ message: 'Order successfully updated', updatedOrder });

}

//to cancel order

const cancelOrder = async (req, res, next) => {


    const orderById = await Order.findById(req.params.id);
    console.log("orderById",orderById);
    

    if (!orderById) {
        console.log("idddd")
        return next(CustomError('Order with this ID is not found',404))
    }
    
    if (orderById.paymentStatus == "completed") {
        return res.status(200).json({message:'Cannot cancel this order, already paid'});
    }
    
    orderById.paymentStatus = 'cancelled';
    orderById.shippingStatus = 'cancelled';


    await orderById.save();

    res.status(200).json({status:'success',message:'Order successfully cancelled',orderById});
};
module.exports = { createOrder,getAllOrders,cancelOrder,verifyOrder };
