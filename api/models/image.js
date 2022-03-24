const mongoose = require('mongoose');

const imageType = mongoose.Schema({
    fileId: String,
    name: String,
    filePath:String,
    url:String,
    height:Number,
    width:Number,
    thumbnailUrl:String
});

module.exports = imageType