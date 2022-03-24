
const Tag = require('../models/tag');
const User = require('../models/user');
const validate = require('../utils/inputErrors');
const isBoolean = require('../utils/toBoolean');

const {nameProperties,slugProperties,statusProperties} = require('./inputs/tag')

const {authorities}= require('../utils/authority')


//! ----- RETRIEVE A SINGLE TAG ----------
/* exports.getTag = async (req, res, next) => {

} */

//! ----- RETRIEVE ALL TAGS ----------
exports.getAllTags = async (req, res, next) => {
    const tags = await Tag.find({deleted:false});

    if(!tags){
        return res.status(404).json({
            tags:[],
            message:'No tag existed yet'
        })
    }
    return res.status(200).json({
        tags:tags,
        message:'Opperation successed'
    })
}



//! ----- CREATE A MULTIPLE TAGS ----------

exports.createMutipleTags = async (req, res, next) => {
    const names =req.body.tags
    const currentUserId = req.body.currentUserId

    function capitalize(str) {
        return str.charAt(0).toUpperCase() + str.slice(1);
    }

    console.log('NAMES:',names)

    const tags = names.map(name=>name.split(' ').map(capitalize).join(' '));
    const filtredTags = await Tag.find({name:{$in:tags}})
    const newTags = tags.filter(tag=>!filtredTags.includes(tag)).map(name=>({name:name,slug:name.split(' ').join('-').toLowerCase(),status:true,createdBy:currentUserId}))
        
   
    const savedTag  = await Tag.insertMany(newTags);
    if(!savedTag){
        return res.status(500).json({
            tags:null,
            message:'Server failed to save the new tag'
        })
    }
    return res.status(201).json({
        tags:savedTag,
        message:`${names.length>1?'Tags have':'a tag has'} been saved successfully'`
    })
}


//! ----- CREATE A NEW TAG ----------
exports.createTag = async (req, res, next) => {
    const name = req.body.name
    const slug = req.body.slug
    const currentUserId = req.body.currentUserId

    const isError = [
        await validate(name,nameProperties),
        await validate(slug,slugProperties),
    ].filter(e=>e!==true);
    

    
    const tag = name.split(' ').map(capitalize).join(' ');
    const tagExisted = await Tag.find({name:tag})

    if(tagExisted.length){
        isError.push({Tag:`The ${tag} already exist in database !`})
    }

    if(isError.length){
        return res.status(500).json({
            errors:isError,
            data:null,
        })
    }
    
    function capitalize(str) {
        return str.charAt(0).toUpperCase() + str.slice(1);
    }
    const newName= name.trim().split(' ').map(capitalize).join(' ');

    const newSlug= slug.trim().split(' ').join('-').toLowerCase();
        
    const newTag = await new Tag({
        name:newName,
        status:true,
        slug:newSlug,
        createdBy:currentUserId
    })

    const savedTag  = await newTag.save();
    if(!savedTag){
        return res.status(500).json({
            tag:null,
            message:'Server failed to save the new tag'
        })
    }
    return res.status(201).json({
        tag:savedTag,
        message:'tag saved successfully'
    })
}


//! ----- EDIT A TAG ----------
exports.updateTag = async (req, res, next) => {
    const tagId = req.params.id
    const currentUserId= req.body.currentUserId
    const name = req.body.name
    const slug = req.body.slug
    const status = isBoolean(req.body.status);

    const isError = [
        await validate(name,nameProperties),
        await validate(slug,slugProperties),
        await validate(status,statusProperties)
    ].filter(e=>e!==true);


    if(isError.length){
        return res.status(500).json({
            errors:isError,
            data:null,
        })
    }

    
    function capitalize(str) {
        return str.charAt(0).toUpperCase() + str.slice(1);
    }
    const newName= name.trim().split(' ').map(capitalize).join(' ');
    const newSlug= slug.trim().split(' ').join('-').toLowerCase();

    const tag = await Tag.findOne({_id:tagId})

    tag.name = newName;
    tag.slug = newSlug;
    tag.status = status;
    tag.updatedBy = currentUserId
    const updatedTag  = await tag.save();

    if(!updatedTag){
        return res.status(500).json({
            tag:null,
            message:'Server failed to update the current tag'
        })
    }
    return res.status(200).json({
        tag:updatedTag,
        message:'Tag updated successfully'
    })
}



//! ----- DELETE A TAG ----------
exports.deleteTag = async (req, res, next) => {
    const tagId = req.params.id;
    const currentUserId = req.body.currentUserId

    const currentUser = await User.findById(currentUserId)
    if(authorities.includes(currentUser.authority)){
        const tag = await Tag.findOneAndUpdate({_id:tagId},{deletedBy:currentUser._id,deleted:true})
        if(!tag){
            return res.status(404).json({
                tag:null,
                message:'Tag not found'
            })
        }

        return res.status(200).json({
            tag:tag,
            message:`Tag ${tag.name} has been deleted successfully`
        })
    }
    return res.status(403).json({
        tag:null,
        message:'Not authorised to delete a tag'
    })
}





