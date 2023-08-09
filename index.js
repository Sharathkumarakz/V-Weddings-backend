const express = require('express')
const cors = require('cors')
const mongoose = require('mongoose')
const cookieParser = require('cookie-parser')
const fileUpload=require('express-fileupload');

//.env
require('dotenv').config()
const app = express()

//app setups
app.use(cookieParser())
app.use(express.json());

//cross origin resource sharing
app.use(cors({
    credentials: true,
    origin:[`${process.env.BASE_URL}`]
  }));

//DB-connection
mongoose.connect(process.env.MONGO_DB, {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(() => {
    console.log('DB-Connected')
    app.listen(5000, () => {
        console.log("app listening @5000");
    })
}).catch((error) => {
    console.log('somthing wrong', error)
})

//file upload
app.use(fileUpload({
    useTempFiles:true
  }))

//route configuration
const userRoute = require('./routes/user')
app.use('/', userRoute)

const adminRoute = require('./routes/admin')
app.use('/admin', adminRoute)