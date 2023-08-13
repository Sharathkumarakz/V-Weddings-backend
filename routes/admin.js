const express = require('express');
const adminRoute=express();

//auth
const { adminAuthentication } = require("../middleware/auth");


//controllers
const adminController=require('../controllers/adminController')

adminRoute.get('/adminActive',adminAuthentication,adminController.adminActive) //user active or inactive

adminRoute.post('/login',adminController.login) //user login 

adminRoute.post('/addCategory',adminController.addCategory) //add category 

adminRoute.get('/category',adminController.categories) //add category 

adminRoute.post('/addImage',adminAuthentication,adminController.addImage) //add image 

adminRoute.get('/category/:id',adminController.categoryWiseImages) //add category 

adminRoute.get('/categoryDetails/:id',adminController.getCategory) //get category details  

adminRoute.post('/deleteCategory/:id',adminAuthentication,adminController.deleteCategory) //add category 

adminRoute.post('/deleteImage/:id',adminAuthentication,adminController.deleteImage) //add image 

adminRoute.get('/categoryImage/:id',adminController.categoryWiseImagesDetails) //add category 

adminRoute.get('/images',adminController.getAllImg) //add category 


adminRoute.get('/users',adminController.getAllUsers) //add category 

adminRoute.post('/unBlockUser/:id',adminAuthentication,adminController.blockUser) //add image 

adminRoute.post('/blockUser/:id',adminAuthentication,adminController.unBlockUser) //add image 

module.exports=adminRoute