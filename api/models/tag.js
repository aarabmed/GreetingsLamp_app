const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const tagSchema = new Schema({
    name : {
        type:String,
        required:true,
    },
    slug :{
        type:String,
        required:true,
    },
    status:{
        type:Boolean,
        required:true
    },
    deleted:{
        type:Boolean,
        default:false
    },
    statusUpdatedBy:{
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

module.exports = mongoose.model('Tag',tagSchema)