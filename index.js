const express = require('express')
const cors = require('cors')
const mongoose = require('mongoose')
const cookieParser = require('cookie-parser')

//.env
require('dotenv').config()
const app = express()

//app setups
app.use(cookieParser())
app.use(express.json());

//cross origin resource sharing
app.use(cors({
    credentials: true,
    origin:'http://localhost:4200'
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

//route configuration
const userRoute = require('./routes/user')
app.use('/', userRoute)

const adminRoute = require('./routes/admin')
app.use('/admin', adminRoute)