const mongoose=require('mongoose');

const imageSchema=new mongoose.Schema({
  image:{
    type:String,
    required:true
  },
  category:{
    type: mongoose.Schema.Types.ObjectId,
    ref: "Category",
    required: true
  },
  description:{
    type:String,
    default:null
  },
  imagePublicId:{
    type:String,
    default:null
  },
  likes:{
    type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }]   
  }
});

module.exports=mongoose.model("Image",imageSchema);