//db
const Admin = require('../models/admin');
const Category = require('../models/category');
const Image = require('../models/image')

//cloudinary
const { uploadToCloudinary, removeFromCloudinary } = require('../middleware/cloudinary');


//jwt
const jwt = require('jsonwebtoken');

const login = async (req, res, next) => { //mail verification
    try {
        const { email, password } = req.body
        if (!email || !password) {
            return res.status(401).send({
                message: "login failed due to lack credentials  "
            });
        } else {
            const admin = await Admin.findOne({ email: email })
            if (!admin) {
                return res.status(401).send({
                    message: "User not Found"
                });
            }
            if (password != admin.password) {
                return res.status(401).send({
                    message: "Password is incorrect"
                });
            } else {
                const jwttoken = jwt.sign({ _id: admin._id }, process.env.JWT_ADMIN_SECRETKEY);
                res.status(200).json({ jwttoken });
            }
        }
    } catch (error) {
        return res.status(400).send({
            message: "mail verification failed"
        });
    }
}


const adminActive = async (req, res, next) => { //mail verification
    try {
        const claims = req.headers?.adminId
        if (!claims) {
            return res.status(400).send({
                message: "unauthenticated"
            });
        } else {
            let admin = await Admin.findOne({ _id: claims })
            return res.status(200).send({ admin })
        }
    } catch (error) {
        return res.status(400).send({
            message: "admin authentication failed"
        });
    }
}

const addCategory = async (req, res, next) => { //user registration
    try {
        const { category, description } = req.body
        if (!category || !description) {
            return res.status(400).send({
                message: "Missing Credentials "
            });
        } else {
            let categoryAlreadyExist = await Category.findOne({ name: category })
            if (categoryAlreadyExist) {
                return res.status(200).send({
                    message: "category already exist "
                });
            } else {
                let categoryData = new Category({
                    name: category,
                    description: description
                })
                let save = await categoryData.save()
                let allCategory = await Category.find({})
                return res.status(200).json(allCategory)
            }
        }
    } catch (err) {
        return res.status(400).send({
            message: "add category failed"
        });
    }
}

const categories = async (req, res, next) => { // get all gategories
    try {
        let allCategory = await Category.find({})
        return res.status(200).json(allCategory)
    } catch (error) {
        return res.status(400).send({
            message: "get category failed"
        });
    }
}


const addImage = async (req, res, next) => {  //add image
    try {
        const details = JSON.parse(req.body.textFieldName);
        const file = req.files.image;
        const image = await uploadToCloudinary(file.tempFilePath, "v-Weddings-pictures");
        const categoryDetails = await Category.findOne({ name: details.category })
        let post = new Image({
            image: image.url,
            category: categoryDetails._id,
            description: details.description,
            imagePublicId: image.public_id
        })
        await post.save()
        const images = await Image.find({});

        res.send(images);
    } catch (error) {
        return res.status(400).send({
            message: "image upload failed"
        });

    }
}


const categoryWiseImages = async (req, res, next) => { //category wise image getting
    try {
        let data = await Image.find({ category: req.params.id }).populate('category')
        res.send(data);
    } catch (error) {
        return res.status(400).send({
            message: "get categoryWiseImage failed"
        });
    }
     
}


const getCategory = async (req, res, next) => { //category wise image getting
    try {
        let data = await Category.find({ _id: req.params.id })
        res.send(data);
    } catch (error) {
        return res.status(400).send({
            message: "get categoryWiseImage failed"
        });
    }
     
}


//exports all function
module.exports = {
    login,
    adminActive,
    addCategory,
    categories,
    addImage,
    categoryWiseImages,
    getCategory
}