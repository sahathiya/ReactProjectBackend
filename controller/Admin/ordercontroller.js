const Order = require('../../model/orderSchema')
const customError = require('../../utils/customError')

//to get all users
const allOrders = async (req, res, next) => {
    const orders = await Order.find()
    .populate('products.productId')
    .populate('UserID')
    .populate('address')
    if (!orders) {
        return next(new customError('order not found', 404))

    }
     
    res.status(200).json({ status: 'success', message: 'all orders', orders })
}



//to get a specific users orders
const OrderByUserId = async (req, res, next) => {
    const order = await Order.findOne({ UserID: req.params.id }).populate('products.productId').populate('UserID')
    console.log(order);
    if (!order) {

        return next(new customError('order not found', 404))
    }
    res.status(200).json({ status: 'success', message: 'order found', order })

}


//Total products purchased
const totalProducts = async (req, res) => {
    const order = await Order.find().populate('products.productId')
    const total = order.reduce((total, item) => {
        return total + item.products.reduce((totalp, order) => {
            return totalp + order.quantity
        }, 0)
    }, 0)

    console.log(total);

    res.status(200).json({ status: 'success', message: 'totalproducts', total })

}


//Total revenue generated

const totalRevenue = async (req, res) => {
    const totalamount = await Order.aggregate([
        { $match: { paymentStatus: { $ne: 'cancelled' } } },

        {
            $group: {
                _id: null,
                revenew: { $sum: "$amount" }
            }
        }
    ])


    console.log(totalamount);

    res.status(200).json({ status: 'success', message: 'total revenue', totalamount })



}

// // Daily revenue calculation
const dailyRevenue = async (req, res) => {
    // ---- Get today's date without time ----
  const currentDate = new Date();
  currentDate.setHours(0, 0, 0, 0);  
  const nextDay = new Date(currentDate);
  nextDay.setDate(currentDate.getDate() + 1);  

  console.log("currentDate", currentDate);
  console.log("nextDay", nextDay);


  const dailyrevanu = await Order.aggregate([
    {
      $match: {
        purchaseDate: { $gte: currentDate, $lt: nextDay }, 
        paymentStatus: { $ne: "cancelled" } 
      }
    },
    {
      $group: {
        _id: null,
        revenew: { $sum: "$amount" },
      }
    }
  ]);
  console.log("Daily Revenue:", dailyrevanu);
  const dailyRevenue = dailyrevanu.length > 0 ? dailyrevanu[0].revenew : 0;
  console.log("dailyRevenue",dailyRevenue);
  

  res.status(200).json({status :"success",message:"retrived",data:dailyRevenue})
};








const totalOrders=async(req,res)=>{
    
       
        const orders = await Order.find({ paymentStatus: "completed" }).populate("products.productId").populate("UserID");
    
        
        if (!orders || orders.length === 0) {
          return res.status(404).json({
            status: "not found",
            message: "No completed orders found",
          });
        }
    
        
        res.status(200).json({
          status: "success",
          message: "Retrieved all completed orders",
          orders,
        });
     

}













const getDailyAndTotalRevenue = async (req, res, next) => {
    try {
      const revenueData = await Order.aggregate([
        {
         
          $project: {
            amount: 1,
            dayOfWeek: { $dayOfWeek: "$purchaseDate" }, 
          },
        },
        {
          
          $group: {
            _id: "$dayOfWeek", 
            dailyRevenue: { $sum: "$amount" },
          },
        },
        {
          
          $sort: { _id: 1 },
        },
      ]);
  
      
      const dayMap = {
        1: "Sunday",
        2: "Monday",
        3: "Tuesday",
        4: "Wednesday",
        5: "Thursday",
        6: "Friday",
        7: "Saturday",
      };
  
      const dailyRevenue = revenueData.map((entry) => ({
        day: dayMap[entry._id],
        revenue: entry.dailyRevenue,
      }));
  
      return res.status(200).json({
        status: "success",
        dailyRevenue,
        
      });
    } catch (error) {
      next(error);
    }
  };
  

module.exports = { allOrders, OrderByUserId, totalProducts, totalRevenue ,dailyRevenue,getDailyAndTotalRevenue,totalOrders}