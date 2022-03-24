const mongoose = require('mongoose');
const mongoosePaginate = require('mongoose-paginate-v2');
const Schema = mongoose.Schema;

const ImageType = require("./image")


  
const cardSchema = new Schema({
    cardType:{
        type:String,
        required:true
    },
    collectionName:{
        type:String,
        required:true
    },
    title : {
        type:String,
        required:true,
    },
    slug :{
        type:String,
        required:true,
    },
    views :{
        type:Number,
        default:0,
    },
    downloads :{
        type:Number,
        default:0,
    },
    description :{
        type:String,
    },
    image:{
        type:ImageType,
        required:true
    },
    status:{
        type:Boolean,
        required:true
    },
    deleted:{
        type:Boolean,
        default:false
    },
    orientation:{
        type:String,
        required:true
    },
    relatedCategories:[{
        type:Number,
        required:true,
    }],
    category:[{
        type:Schema.Types.ObjectId,
        ref:'Category'
    }],
    subCategory:[{
        type:Schema.Types.ObjectId,
        ref:'SubCategory'
    }],
    subCategoryChildren:[{
        type:Schema.Types.ObjectId,
        ref:'ChildrenSubCategory'
    }],
    tags:[{
        type:Schema.Types.ObjectId,
        ref:'Tag'
    }],
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
    }
},{timestamps: true})

cardSchema.plugin(mongoosePaginate);

module.exports = mongoose.model('Card',cardSchema)