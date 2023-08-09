const express = require("express");
const userRoute = express();

//auth
const { userAuthentication } = require("../middleware/auth");


//controller
const authController=require('../controllers/authController');
const userController=require('../controllers/userController');
userRoute.post('/register',authController.register) //user registration

userRoute.post('/verifyMail',authController.verifyMail) //verify mail

userRoute.get('/user',userAuthentication,authController.userActive) //user active or inactive

userRoute.post('/login',authController.login) //user login 

userRoute.get('/likeImage/:id',userAuthentication,userController.likeImage) //user active or inactive

module.exports=userRoute