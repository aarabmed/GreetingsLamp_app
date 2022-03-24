const mongoose = require('mongoose');
const mongoosePaginate = require('mongoose-paginate-v2');
const ImageType = require('./image')

const Schema = mongoose.Schema;

const invitationSchema = new Schema({
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
        required:true,
        default:0,
    },
    description :{
        type:String,
    },
    category:{
        type:Schema.Types.ObjectId,
        ref:'Category'
    },
    subCategory:{
        type:Schema.Types.ObjectId,
        ref:'SubCategory'
    },
    subCategoryChild:{
        type:Schema.Types.ObjectId,
        ref:'ChildrenSubCategory'
    },
    tags:[{
        type:Schema.Types.ObjectId,
        ref:'Tag'
    }],
    image:{
        type:ImageType,
        required:true
    },
    invitationSize:[{
        type:String,
    }],
    status:{
        type:Boolean,
        required:true
    },
    deleted:{
        type:Boolean,
        default:false
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
    }
},{timestamps: true})

invitationSchema.plugin(mongoosePaginate);

module.exports = mongoose.model('Invitation',invitationSchema)