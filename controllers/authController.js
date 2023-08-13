
//DB-models
const User = require('../models/user');
const Token = require('../models/token');

//bcrypt
const bcrypt = require('bcrypt');
const crypto = require('crypto')
//mail
const sendEmail = require('../middleware/nodemailer')
//jwt
const jwt = require('jsonwebtoken');


const register = async (req, res, next) => { //user registration
    try {
        const { username, password, email, phone } = req.body
        if (!username || !email || !password || !phone) {
            return res.status(400).send({
                message: "Missing Credentials "
            });
        } else {
            const userAlreadyExist = await User.findOne({ email: req.body.email })
            if (userAlreadyExist && userAlreadyExist.verified == true) {
                return res.status(401).send({
                    message: "Email already exist "
                });
            }
            if (userAlreadyExist && userAlreadyExist.verified == false) {
                const usertokenExist = await Token.findOne({ userId: userAlreadyExist._id })
                if (usertokenExist) {
                    return res.status(201).send({ message: "An Email has been sent to your account please Verify" })
                } else {
                    const token = crypto.randomBytes(32).toString("hex")
                    const Ttoken = await new Token({
                        userId: userAlreadyExist._id,
                        token: token
                    }).save();
                    const url = `${process.env.BASE_URL}/v-wedding/${userAlreadyExist._id}/verify/${Ttoken.token}`
                    sendEmail(email, "Verify Email", url)
                    return res.status(201).send({ message: "An Email has been sent to your account please Verify" })
                }
            } else {
                const hashedPassword = await bcrypt.hash(password, 10);
                let user = new User({
                    username: username,
                    password: hashedPassword,
                    email: email,
                    phone: phone
                })
                const userSaved = await user.save()
                const token = crypto.randomBytes(32).toString("hex")
                const Ttoken = await new Token({
                    userId: userSaved._id,
                    token: token
                }).save();
                const url = `${process.env.BASE_URL}/v-wedding/${userSaved._id}/verify/${Ttoken.token}`
                sendEmail(email, "Verify Email", url)
                return res.status(201).send({ message: "An Email has been sent to your account please Verify" })
            }
        }
    } catch (err) {
        return res.status(400).send({
            message: "Registration failed"
        });
    }
}


const verifyMail = async (req, res, next) => { //mail verification
    try {
        const { userId, token } = req.body
        if (!userId || !token) {
            return res.status(401).send({
                message: "verify mail failed due to lack credentials  "
            });
        } else {
            const user=await User.findOne({ _id:userId}) 
            if(!user)return res.status(400).send({message:'invalid Link'})

            const tokendetails=await Token.findOne({token:token})
            if(!tokendetails){
                return res.status(400).send({message:'invalid Link'})
            }
           await User.updateOne({ _id: userId }, {$set: { verified: true } })

            await Token.deleteOne({ token: token })
            const jwttoken = jwt.sign({ _id: userId }, process.env.JWT_USER_SECRETKEY);
            res.status(200).json({ jwttoken });
        }
    } catch (error) {
        return res.status(400).send({
            message: "mail verification failed"
        });
    }
}



const userActive = async (req, res, next) => { //mail verification
    try {
        const claims = req.headers?.userId
        if (!claims) {
            return res.status(400).send({
                message: "unauthenticated"
            });
        } else {
            let user = await User.findOne({ _id: claims })
            return res.status(200).send({ user })
        }
    } catch (error) {
        return res.status(400).send({
            message: "mail verification failed"
        });
    }
}


const login = async (req, res, next) => { //mail verification
    try {
        const { email, password } = req.body
        if (!email || !password) {
            return res.status(401).send({
                message: "login failed due to lack credentials  "
            });
        } else {
            const user = await User.findOne({ email: email })
            if (!user) {
                return res.status(401).send({
                    message: "User not Found"
                });
            }
            if (!user.verified) {
                const usertokenExist = await Token.findOne({ userId: user._id })
                if (usertokenExist) {
                    await Token.deleteOne({ userId: user._id })
                }

                
                const token = crypto.randomBytes(32).toString("hex")
                const Ttoken = await new Token({
                    userId: user._id,
                    token: token
                }).save();
                const url = `${process.env.BASE_URL}/v-wedding/${user._id}/verify/${Ttoken.token}`
                sendEmail(email, "Verify Email", url)
                return res.status(401).send({ message: "An Email has been sent to your account please Verify" })
            
            } else {
                const passwordMatch = await bcrypt.compare(password, user.password);
                if (!passwordMatch) {
                    return res.status(401).send({
                        message: "Password is incorrect"
                    });
                } else {
                    const jwttoken = jwt.sign({ _id: user._id }, process.env.JWT_USER_SECRETKEY);
                    res.status(200).json({ jwttoken });
                }
            }
        }

    } catch (error) {
        return res.status(400).send({
            message: "mail verification failed"
        });
    }
}

module.exports = {
    register,
    verifyMail,
    userActive,
    login
}