const jwt = require('jsonwebtoken')
const User=require('../models/user')
module.exports = {
     userAuthentication(req, res, next) {
        const cookie = req.headers.authorization
        if (!cookie) {      
            return res.status(401).send({
                message: "UnAuthenticated"
            })
        }
        jwt.verify(cookie, process.env.JWT_USER_SECRETKEY, (err, decode) => {
            if (err) {
                return res.status(401).send({
                    message: "UnAuthenticated"
                })
            }
            if (decode){
                req.headers.userId = decode._id
        //   let user async=await User.findOne({_id:decode._id})
        User.findOne({ _id: decode._id })
        .then(userdata => {
            if (userdata.isBlocked === true) {
                return res.status(403).send({
                    message: "Access Denied - User is not allowed"
                });
            } else {
                next(); // Proceed to the next middleware
            }
        })
        .catch(err => {
            return res.status(500).send({
                message: "Internal Server Error"
            });
        });
            } else {
                return res.status(401).send({
                    message: "UnAuthenticated"
                })
            }
        });
    },

    adminAuthentication(req, res, next) {
        const cookie = req.headers.authorization
        if (!cookie) {      
            return res.status(401).send({
                message: "UnAuthenticated"
            })
        }
        jwt.verify(cookie, process.env.JWT_ADMIN_SECRETKEY, (err, decode) => {
            if (err) {
                return res.status(401).send({
                    message: "UnAuthenticated"
                })
            }
            if (decode) {
                req.headers.adminId = decode._id
                next()
            } else {
                return res.status(401).send({
                    message: "UnAuthenticated"
                })
            }
        });
    }

    
}