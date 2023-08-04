const express = require('express');
const adminRoute=express();

//controllers
const adminController=require('../controllers/adminController')

adminRoute.post('/login',adminController.login) //user login 

adminRoute.post('/addCategory',adminController.addCategory) //add category 

adminRoute.get('/category',adminController.categories) //add category 

module.exports=adminRoute