const express=require('express')
const app=express()

require('dotenv').config()
app.use(express.json())
const mongoose=require('mongoose')
 const cors=require('cors')
 const userRoutes=require('./routes/userRoute')
 const adminRoutes=require('./routes/adminRoute')

 app.use(cors({
    origin: 'http://localhost:3000', // Specific origin of your frontend
    credentials: true                // Allow cookies to be included in requests
}));
 const cookieParser = require('cookie-parser');
 app.use(cookieParser());
 app.use('/',userRoutes)
 app.use('/admin',adminRoutes)


mongoose.connect(process.env.MONGODB_URL)
.then(()=>console.log('connected'))
.catch((err)=>console.log(err))






const PORT=process.env.PORT||5000
app.listen(PORT,()=>{
    console.log(`server running on ${PORT}`);
    
})
