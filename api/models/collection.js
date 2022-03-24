const mongoose = require('mongoose');
const ImageType = require('./image')

const Schema = mongoose.Schema;


//!============= Category
const collectionSchema = new Schema({
    name : {
        type:String,
        required:true,
    },
    title : {
        type:String,
        required:true,
    }, 
    slug:{
        type:String,
        required:true
    },
    description :{
        type:String,
        required:true,
    },
    image:{
        type:ImageType,
        required:true
    },
    status:{
        type:Boolean,
        required:true,
        default:false
    },
    deleted:{
        type:Boolean,
        default:false,
    },
    createdBy:{
        type:Schema.Types.ObjectId,
        ref:'User'
    },
    deletedBy:{
        type:Schema.Types.ObjectId,
        ref:'User'
    },
    updatedBy:{
        type:Schema.Types.ObjectId,
        ref:'User'
    },
    category:[{
        type:Schema.Types.ObjectId,
        ref:'Category'
    }],
},{timestamps: true})


module.exports = mongoose.model('Collection',collectionSchema)