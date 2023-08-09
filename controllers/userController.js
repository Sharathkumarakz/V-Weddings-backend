


//DB-models
const User = require('../models/user');
const Image=require('../models/image');


const likeImage = async (req, res, next) => { //like || unlike 
    try {
        const userId = req.headers?.userId
        if (!userId) {
            return res.status(400).send({
                message: "unauthenticated"
            }); 
        } else {
            const image = await Image.findOne({ _id:req.params.id})
            if(image.likes.includes(userId)){
                await Image.updateOne({ _id: req.params.id }, { $pull: { likes: userId } });
            }else{
                await Image.updateOne({ _id: req.params.id }, { $push: { likes: userId } });
            }
            let result = await Image.findOne({_id:req.params.id})
            return res.status(200).send( result )
        }
    } catch (error) {
        return res.status(400).send({
            message: "mail verification failed"
        });
    }
}


const sendMail = async (req, res, next) => { //like || unlike 
    try {
        const userId = req.headers?.userId
        if (!userId) {
            return res.status(400).send({
                message: "unauthenticated"
            }); 
        } else {
        const user=await User.findOne({_id: userId})
        const {subject,txt} = req.body
        
        }
    } catch (error) {
        return res.status(400).send({
            message: "mail verification failed"
        });
    }
}


module.exports = {
    likeImage,
    sendMail
}