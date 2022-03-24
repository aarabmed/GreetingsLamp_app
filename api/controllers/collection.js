const fs = require("fs")
const Collection = require('../models/collection');
const User = require('../models/user');
const Image = require('../models/image');

const validate = require('../utils/inputErrors');
const isBoolean = require('../utils/toBoolean');

const {nameProperties,slugProperties,titleProperties,statusProperties,descriptionProperties,imageProperties} = require('./inputs/collection')

const {authorities}= require('../utils/authority');


//! ----- RETRIEVE A SINGLE COLLECTION ----------
exports.getCollection = async (req, res, next) => {
    const id = req.params.id
    const collection = await Collection.findById({_id:id},{deleted:false})
    .populate([{   
                    path:"category",select:"name status slug backgroundColor description title createdAt updatedAt",model:'Category',match:{deleted:false},
                    populate:[{
                        path:"subCategory",
                        select:"name status slug description title backgroundColor createdAt updatedAt category",
                        match:{deleted:false},
                            populate:[{
                                path:"childrenSubCategory",
                                select:"name status slug backgroundColor title description createdAt updatedAt",
                                match:{deleted:false},
                                populate:{path:"image",model:'Image'}
                            },
                            {path:"image",model:'Image'}
                        ],
                    },{path:"image",model:'Image'}]
            },{path:"image",model:'Image'}
    ]);

    return res.status(200).json({
        collection:collection,
        message:'Opperation successed'
    })
}

// errors:{message:
//! ----- RETRIEVE ALL COLLECTION ----------
exports.getAllCollections = async (req, res, next) => {
    const collections = await Collection.find({deleted:false}).populate([
        {path:"category",select:"name status slug backgroundColor description title createdAt updatedAt",model:'Category',match:{deleted:false},
            populate:[
                {
                    path:"subCategory",
                    select:"name status slug description title backgroundColor createdAt updatedAt category ",
                    model:'SubCategory',
                    match:{deleted:false},
                        populate:[
                            {
                                path:"childrenSubCategory",
                                select:"name status slug backgroundColor title description createdAt updatedAt",
                                model:'ChildrenSubCategory',
                                match:{deleted:false},
                                populate:{path:"image",model:'Image'}
                            },
                            {path:"image",model:'Image'}
                        ],
                },{
                    path:"image",
                    model:'Image',
                }
            ]
        },{path:"image",model:'Image'}
    ]);


    return res.status(200).json({
        collections:collections,
        message:'Opperation successed'
    })
}




//! ----- CREATE A NEW COLLECTION ----------
exports.createCollection = async (req, res, next) => {
    const name = req.body.name.trim();
    const slug = req.body.slug.trim();
    const title = req.body.title.trim();
    const description = req.body.description.trim();
    const collectionImage = req.body.image
    const currentUserId = req.body.currentUserId
    let isError = [];

    


    isError = [
        ...isError,
        await validate(name,nameProperties),
        await validate(title,titleProperties),
        await validate(slug,slugProperties),
        await validate(description,descriptionProperties),
    ].filter(e=>e!==true);


    if(isError.length){
        return res.status(500).json({
            errors:isError,
            collection:null,
        })
    }


    

    function capitalize(str) {
        return str.charAt(0).toUpperCase() + str.slice(1);
    }
    const newName= name.trim().split(' ').map(capitalize).join(' ');
    const newTitle= title.trim().split(' ').map(capitalize).join(' ');
    const newSlug= slug.trim().split(' ').join('-').toLowerCase();
       
   
    const collection =  new Collection({
        name:newName,
        description:description,
        title:newTitle,
        image:collectionImage,
        slug:newSlug,
        createdBy:currentUserId
    })

    const savedCollection  = await collection.save();
   
    
    if(savedCollection){  
        return res.status(201).json({
            collection:savedCollection,
            message:'Collection saved successfully'
        })
    }

    return res.status(500).json({
        collection:null,
        errors:{message:'Server failed to create the current Collection'}
    })
}


//! ----- EDIT A COLLECTION ----------
exports.updateCollection = async (req, res, next) => {

    const collectionId = req.params.id;
    const currentUserId= req.body.currentUserId;
    const name = req.body.name.trim();
    const title = req.body.title.trim();
    const slug = req.body.slug.trim();
    const description = req.body.description.trim();
    const status = isBoolean(req.body.status.trim());
    const collectionImage = req.body.image
    let isError = [];
    


    isError = [
        ...isError,
        await validate(name,nameProperties),
        await validate(slug,slugProperties),
        await validate(status,statusProperties),
        await validate(title,titleProperties),
        await validate(description,descriptionProperties),
    ].filter(e=>e!==true);

    if(isError.length){
        return res.status(500).json({
            errors:isError,
            collection:null,
        })
    }

    
    function capitalize(str) {
        return str.charAt(0).toUpperCase() + str.slice(1);
    }

    const newName= name.trim().split(' ').map(capitalize).join(' ');
    const newSlug= slug.trim().split(' ').join('-').toLowerCase();
    const newTitle= title.trim().split(' ').map(capitalize).join(' ');

    const collection = await Collection.findById(collectionId)

    collection.name = newName;
    collection.slug = newSlug;
    collection.title = newTitle;
    collection.status = status;
    collection.updatedBy = currentUserId
    collectionImage?collection.image=collectionImage:null;
    
    const updatedCollection  = await collection.save();

    if(!updatedCollection){
        return res.status(500).json({
            collection:null,
            errors:{message:'Server failed to update the current Collection'}
        })
    }

    return res.status(200).json({
        collection:updatedCollection,
        message:'Collection updated successfully'
    })
}




//! ----- DELETE A COLLECTION ----------
exports.deleteCollection = async (req, res, next) => {
    const collectionId = req.params.id;
    const currentUserId = req.body.currentUserId

    const currentUser = await User.findById(currentUserId)

    if(authorities.includes(currentUser.authority)){
        const collection = await Collection.findOneAndUpdate({_id:collectionId},{deletedBy:currentUser._id,deleted:true})
        if(!collection){
            return res.status(404).json({
                collection:null,
                errors:{message:'Collection not found'}
            })
        }

        await Image.findByIdAndUpdate({_id:collection.image},{deleted:true})

        return res.status(200).json({
            collection:collection,
            message:`Tag ${collection.name} has been deleted successfully`
        })
    }
    return res.status(403).json({
        collection:null,
        errors:{message:'Not authorised to delete the collection'}
    })
}



