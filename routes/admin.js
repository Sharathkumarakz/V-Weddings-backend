const express = require('express');
const adminRoute=express();

//controllers
const adminController=require('../controllers/adminController')

adminRoute.post('/login',adminController.login) //user login 

adminRoute.post('/addCategory',adminController.addCategory) //add category 

adminRoute.get('/category',adminController.categories) //add category 

adminRoute.post('/addImage',adminController.addImage) //add image 

adminRoute.get('/category/:id',adminController.categoryWiseImages) //add category 

adminRoute.get('/categoryDetails/:id',adminController.getCategory) //get category details  


module.exports=adminRoute