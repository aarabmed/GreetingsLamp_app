const mongoose = require('mongoose');
const ImageType = require('./image')
const Schema = mongoose.Schema;


//!============= Category
const CategorySchema = new Schema({
    customId:{
        type:Number,
        required:true
    },
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
    image:{
        type:ImageType,
        required:true
    },
    description :{
        type:String,
        required:true,
    },
    status:{
        type:Boolean,
        required:true,
        default:true,
    },
    deleted:{
        type:Boolean,
        default:false,
    },
    backgroundColor:{
        type:String,
        required:false,
        default:'#cf00cc'
    },
    collectionName:{
        type:Schema.Types.ObjectId,
        ref:'Collection'
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
    subCategory:[{
        type:Schema.Types.ObjectId,
        ref:'SubCategory'
    }],
},{timestamps: true})




//!============= SubCategory
const SubCategorySchema = new Schema({
    customId:{
        type:Number,
        required:true
    },
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
    description:{
        type:String,
        required:true
    },
    status:{
        type:Boolean,
        required:true,
        default:true,
    },
    image:{
        type:ImageType,
        required:true
    },
    deleted:{
        type:Boolean,
        default:false
    },
    backgroundColor:{
        type:String,
        required:false,
        default:'#cf00cc'
    },
    category:{
        type:Schema.Types.ObjectId,
        ref:'Category'
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
    childrenSubCategory:[{
        type:Schema.Types.ObjectId,
        ref:'ChildrenSubCategory'
    }]
    
    
},{timestamps: true})



//!============= SubCategoryChild
const SubCategoryChildSchema = new Schema({
    customId:{
        type:Number,
        required:true
    },
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
    description:{
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
        default:true,
    }, 
    deleted:{
        type:Boolean,
        default:false
    },
    backgroundColor:{
        type:String,
        required:false,
        default:'#cf00cc'
    },
    subCategory:{
        type:Schema.Types.ObjectId,
        ref:'SubCategory'
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
    
},{timestamps: true})





module.exports ={
    Category : mongoose.model('Category',CategorySchema),
    SubCategory : mongoose.model('SubCategory',SubCategorySchema),
    SubCategoryChild :mongoose.model('ChildrenSubCategory',SubCategoryChildSchema)
} 
    