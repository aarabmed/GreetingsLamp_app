
const {SubCategoryChild, SubCategory} = require('../../models/category');
const User = require('../../models/user');
const Image = require('../../models/image');

const validate = require('../../utils/inputErrors');
const isBoolean = require('../../utils/toBoolean');


const {authorities} = require('../../utils/authority');

const {descriptionProperties,titleProperties,bgColorProperties,statusProperties,imageProperties,slugProperties,nameProperties} = require('../inputs/subChildren')



//! ----- RETRIEVE A SINGLE SUB-CATEGORY-CHILD ----------
/* exports.getCategory = async (req, res, next) => {

} */

//! ----- RETRIEVE ALL SUB-CATEGORIES-CHILDREN ----------
exports.getAllSubChildren = async (req, res, next) => {
    const subChildren = await SubCategoryChild.find({deleted:false}).populate({path:"image",model:'Image'});
  
    return res.status(200).json({
        subCategoryChildren:subChildren,
        message:'Opperation successed'
    })
}

 

//! ----- CREATE A NEW SUB-CATEGORY-CHID ----------
exports.createSubCategoryChild = async (req, res, next) => {
    const currentUserId=req.body.currentUserId;
    const subCategoryId = req.body.subCategory.trim();
    const name = req.body.name.trim();
    const slug = req.body.slug.trim();
    const title = req.body.title.trim();
    const bgColor = req.body.backgroundColor.trim();
    const description = req.body.description.trim();
    const subCategoryChildImage = req.body.image;
    
    
    const isError = [
        await validate(name,nameProperties),
        await validate(slug,slugProperties),
        await validate(title,titleProperties),
        await validate(description,descriptionProperties),
        await validate(bgColor,bgColorProperties),
    ].filter(e=>e!==true);

    

    if(isError.length){
        return res.status(500).json({
            errors:isError,
            message:"Invalid Input!",
        })
    }

    
    function capitalize(str) {
        return str.charAt(0).toUpperCase() + str.slice(1);
    }
    const newName= name.trim().split(' ').map(capitalize).join(' ');
    const newSlug= slug.trim().split(' ').join('-').toLowerCase();
    const newTitle= title.trim().split(' ').map(capitalize).join(' ');

    
    const subCategoryChild = await new SubCategoryChild({
        name:newName,
        title:newTitle,
        slug:newSlug,
        description,
        image:subCategoryChildImage,
        backgroundColor:bgColor,
        subCategory:subCategoryId,
        createdBy:currentUserId,
    })

    
    const savedSubCategoryChild  = await subCategoryChild.save();
    if(!savedSubCategoryChild){
        return res.status(500).json({
            data:null,
            errors:{message:'Server failed to save the new sub Category Child'}
        })
    }

    await SubCategory.findByIdAndUpdate(subCategoryId,{$push:{'childrenSubCategory':savedSubCategoryChild._id}})
    return res.status(201).json({
        data:savedSubCategoryChild,
        message:'sub Category Child saved successfully'
    })
}



//! ----- EDIT A SUB-CATEGORY-CHID ----------
exports.updateSubCategoryChild = async (req, res, next) => {

    const subCategoryChildId = req.params.id;
    const currentUserId=req.body.currentUserId;
    const slug = req.body.slug.trim();
    const name = req.body.name.trim();
    const title = req.body.title.trim();
    const status = isBoolean(req.body.status.trim());
    const description = req.body.description.trim();
    const bgColor = req.body.backgroundColor.trim();
    const subCategoryChildImage = req.body.image;
 


    const isError = [
        await validate(name,nameProperties),
        await validate(slug,slugProperties),
        await validate(title,titleProperties),
        await validate(status,statusProperties),
        await validate(description,descriptionProperties),
        await validate(bgColor,bgColorProperties),
    ].filter(e=>e!==true);




    if(isError.length){
        return res.status(500).json({
            errors:isError,
            data:null,
        })
    }

    
    
    const subCategoryChild = await SubCategoryChild.findOne({_id:subCategoryChildId})

    if(!subCategoryChild){
        return res.status(404).json({
            date:null,
            errors:{message:'Category not found'}
        })
    }
    

    
    function capitalize(str) {
        return str.charAt(0).toUpperCase() + str.slice(1);
    }
    const newName= name.trim().split(' ').map(capitalize).join(' ');
    const newSlug= slug.trim().split(' ').join('-').toLowerCase();
    const newTitle= title.trim().split(' ').map(capitalize).join(' ');


   
    subCategoryChild.description = description;
    subCategoryChild.updatedBy=currentUserId
    subCategoryChild.slug = newSlug;
    subCategoryChild.title = newTitle;
    subCategoryChild.name = newName;
    subCategoryChild.status = status;
    subCategoryChild.backgroundColor = bgColor
    subCategoryChildImage?subCategoryChild.image:null

    

    const updatedSubCategoryChild  = await subCategoryChild.save();


    if(!updatedSubCategoryChild){
        return res.status(500).json({
            errors:{message:'Error while editing the sub category child'},
            data:null
        })
    }
    return res.status(200).json({
        data:updatedSubCategoryChild,
        message:'Sub category child updated successfully'
    })
}


//! ----- DELETE A CATEGORY-CHID ----------
exports.deleteSubCategoryChild = async (req, res, next) => {
    const subCategoryChildId = req.params.id;
    const currentUserId = req.body.currentUserId

    const currentUser = await User.findById(currentUserId)

    if(authorities.includes(currentUser.authority)){
        const subCategoryChild = await SubCategoryChild.findOne({_id:subCategoryChildId})

        if(!subCategoryChild){
            return res.status(404).json({
                date:null,
                errors:{message:'sub Category child not found'}
            })
        }

        subCategoryChild.deleted = true;;
        subCategoryChild.deletedBy = currentUserId
        const deletedSubCategoryChild  = await subCategoryChild.save();

        if(!deletedSubCategoryChild){
            return res.status(500).json({
                data:null,
                errors:{message:'Server failed to delete the sub category child'}
            })
        }

        await Image.findByIdAndUpdate({_id:deletedSubCategoryChild.image},{deleted:true})

        return res.status(200).json({
            data:deletedSubCategoryChild,
            message:`Sub-Category child ${deletedSubCategoryChild.name} has been deleted successfully`
        })
    }

    return res.status(403).json({
        date:null,
        errors:{message:'Not authorised to delete a category'}
    })
}

