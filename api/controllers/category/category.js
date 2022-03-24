const ObjectID = require('mongoose').Types.ObjectId;
const {Category,SubCategory} = require('../../models/category');
const Collection = require('../../models/collection');
const Image = require('../../models/image');

const User = require('../../models/user');
const validate = require('../../utils/inputErrors');
const {authorities}= require('../../utils/authority')
const isBoolean = require('../../utils/toBoolean');

const {nameProperties,statusProperties,titleProperties,bgColorProperties,descriptionProperties,imageProperties,slugProperties} = require('../inputs/category')


//! ----- RETRIEVE A SINGLE CATEGORY ----------
exports.getCategory = async (req, res, next) => {
    const id = req.params.id
    const category = await Category.findById({_id:id},{deleted:false})
    .populate([
        {path:"image",model:'Image'},
        {path:"subCategory",select:"name status slug description title backgroundColor createdAt updatedAt",model:'SubCategory',match:{deleted:false},populate:{path:"image",model:'Image'}},
        {path:"related.relatedTo",match:{deleted:false},populate:{path:"image",model:'Image'}},
        {path:"collectionName",model:'Collection',match:{deleted:false},populate:{path:"image",model:'Image'}}
    ]);
  
    return res.status(200).json({
        category:category,
        message:'Opperation successed'
    })
}

//! ----- RETRIEVE ALL CATEGORIES ----------
exports.getAllCategories = async (req, res, next) => {
    const categories = await Category.find({deleted:false})
        .populate([
            {path:"image",model:'Image'},
            {  
                path:"subCategory",select:"name status slug description title backgroundColor createdAt updatedAt ",model:'SubCategory',match:{deleted:false},
                populate:[{
                    path:"childrenSubCategory",
                    select:"name status slug backgroundColor title description createdAt updatedAt",
                    model:'ChildrenSubCategory',
                    match:{deleted:false},
                    populate:{path:"image",model:'Image'}
                },
                {path:"image",model:'Image'}],
            },
        ]);
    
    return res.status(200).json({
        categories:categories,
        message:'Opperation successed'
    })
}

 

//! ----- CREATE A NEW CATEGORY ----------
exports.createCategory = async (req, res, next) => {

    const currentUserId=req.body.currentUserId
    const name = req.body.name.trim()
    const collectionId = req.body.collection
    const slug = req.body.slug.trim()
    const title = req.body.title.trim()
    const bgColor = req.body.backgroundColor.trim();
    const description = req.body.description.trim();
    const categoryImage = req.body.image;


  
    const isError = [
        await validate(name,nameProperties),
        await validate(slug,slugProperties),
        await validate(title,titleProperties),
        await validate(description,descriptionProperties),
        await validate(bgColor,bgColorProperties),
    ].filter(e=>e!==true);

    



    function capitalize(str) {
        return str.charAt(0).toUpperCase() + str.slice(1);
    }
    const newName= name.trim().split(' ').map(capitalize).join(' ');
    const newSlug= slug.trim().split(' ').join('-').toLowerCase();
    const newTitle= title.trim().split(' ').map(capitalize).join(' ');

    

    if(isError.length){
            return res.status(500).json({
                errors:isError,
                category:null,
            })
    }

    const CategoryInDB = await Category.find({ name: name },{deleted:false});

    if(CategoryInDB.length){
        return res.status(500).json({
            category:null,
            errors:{message:'A category by this name has been already in DataBase '}
        })
    }

   


    const category = await new Category({
        name:newName,
        description,
        image:categoryImage,
        title:newTitle,
        slug:newSlug,
        backgroundColor:bgColor??bgColor,
        createdBy:currentUserId,
        collectionName:collectionId
    })



    const savedCategory  = await category.save();
    
    if(!savedCategory){
        return res.status(500).json({
            category:null,
            errors:{message:'Server failed to create the new category'}
        })
    }

    await Collection.findByIdAndUpdate(collectionId,{ $push: {"category": savedCategory._id } })
    
    return res.status(201).json({
        category:savedCategory,
        message:'Category saved successfully'
    })
}



//! ----- EDIT A CATEGORY ----------
exports.updateCategory = async (req, res, next) => {
    const currentUserId=req.body.currentUserId
    const categoryId = req.params.id;
    const name = req.body.name.trim();
    const title = req.body.title.trim();
    const slug = req.body.slug.trim();
    const bgColor = req.body.backgroundColor.trim();
    const description = req.body.description.trim();
    const status = isBoolean(req.body.status.trim());
    const categoryImage = req.body.image
    

    const isError = [
        await validate(name,nameProperties),
        await validate(slug,slugProperties),
        await validate(status,statusProperties),
        await validate(title,titleProperties),
        await validate(description,descriptionProperties),
        await validate(bgColor,bgColorProperties),

    ].filter(e=>e!==true);



    if(isError.length){
        return res.status(500).json({
            errors:isError,
            category:null
        })
    }



    const category = await Category.findOne({_id:categoryId})

 
    if(!category){
        return res.status(404).json({
            category:null,
            errors:{message:'Category not found'}
        })
    }
     
    
    


    function capitalize(str) {
        return str.charAt(0).toUpperCase() + str.slice(1);
    }
    const newName= name.trim().split(' ').map(capitalize).join(' ');
    const newSlug= slug.trim().split(' ').join('-').toLowerCase();
    const newTitle= title.trim().split(' ').map(capitalize).join(' ');

    category.name = newName;
    category.description = description;
    category.slug = newSlug;
    category.status = status;
    category.title = newTitle;
    category.backgroundColor = bgColor
    category.updatedBy=currentUserId;
    categoryImage?category.image = categoryImage:null;

    const updatedCategory  = await category.save();
    if(!updatedCategory){
        return res.status(500).json({
            errors:{message:'Server failed while editing the category'},
            category:null
        })
    }



    return res.status(200).json({
        category:updatedCategory,
        message:'Category updated successfully'
    })
}


//! ----- DELETE A CATEGORY ----------
exports.deleteCategory = async (req, res, next) => {
    const categoryId = req.params.id;
    const currentUserId = req.body.currentUserId

    const currentUser = await User.findById(currentUserId)

    if(authorities.includes(currentUser.authority)){
        const category = await Category.findOne({_id:categoryId})

        if(!category){
            return res.status(404).json({
                category:null,
                errors:{message:'Category not found'}
            })
        }

        category.deleted = true;
        category.deletedBy=currentUserId

       
        const deletedCategory  = await category.save();

        await Image.findByIdAndUpdate({_id:deletedCategory.image},{deleted:true})

        if(!deletedCategory){
            return res.status(500).json({
                category:null,
                errors:{message:'Server failed to delete the category'}
            })
        }

        return res.status(200).json({
            category:deletedCategory,
            message:`Category ${category.name} has been deleted successfully`
        })
    }

    return res.status(403).json({
        category:null,
        errors:{message:'Not authorised to delete a category'}
    })
}

