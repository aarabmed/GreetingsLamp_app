const Card  =  require('../models/card');
const {Category,SubCategory,SubCategoryChild}  =  require('../models/category');
const User = require('../models/user');
const Tag = require('../models/tag');
const Image = require('../models/image');
const ObjectID = require('mongodb').ObjectId
const validate = require('../utils/inputErrors')
const isBoolean = require('../utils/toBoolean');
const {getPagination,queryBy} = require('../utils/getPagination');
const {authorities}= require('../utils/authority')
const  dimensionOf = require("image-size") 
const filterCategoriesRoute = require("../utils/filterCategoriesRoute")
const {titleProps,statusProps,slugProperties} = require('./inputs/card');
const  isValidID  =require("../utils/IDvalidator")
const valideOrientation = ['landscape','portrait','square'];

var options = {
    allowDiskUse: false
};

//! ----- RETRIEVE A SINGLE CARD ----------
exports.getCard = async (req, res, next) => {
    const id = req.params.id;
    const cardId=id.split('-')[1];
    const categoryId=+id.split('-')[0]<20 || +id.split('-')[0]>999 ? null :+id.split('-')[0]

    

    if(categoryId&&cardId){
        const card = await Card.findOne({$and:[{_id:cardId},{'relatedCategories':{$in:categoryId}},{deleted:false}]})
        .populate([{path:"image",model:'Image'},{path:"category",model:'Category'},{path:"tags",model:'Tag'}])

        if(card){
            const tags = card.tags.map(tag=>ObjectID(tag._id))



            const condition = tags.length?
            {
                tags: {
                    $in: tags
                }
            }:
            {
                relatedCategories: {
                    $in: card.relatedCategories
                }
            }

            const pipeline = [
                {
                    $lookup: {
                        from: "images",
                        localField: "image",
                        pipeline: [
                            {
                                $project: {
                                    _id: "$_id",
                                    path: "$path"
                                }
                            }
                        ],
                        foreignField: "_id",
                        as: "image"
                    }
                }, 
                {
                    $match:{
                        $and: [
                            condition,
                            {
                                _id: {
                                    $not: {
                                        $eq: ObjectID(card._id)
                                    }
                                }
                            }
                        ]
                    }
                    
                }, 
                {
                    $project: {
                        _id:{$concat:[{$toString:{$last:"$relatedCategories"}},"-",{$toString:"$_id"}]},
                        categoryId: {
                            $last: "$relatedCategories"
                        },
                        views: "$views",
                        title: "$title",
                        slug:  "$slug",
                        image: {
                            $arrayElemAt: [
                                "$image",
                                0.0
                            ]
                        }
                    }
                }, 
                {
                    $sort: {
                        "views": -1.0
                    }
                }, 
                {
                    $limit: 8.0
                } 
            ];
        
            const similarCards =  await Card.aggregate(pipeline).option(options)

          
            const category= await card.category.find(cat=>cat.customId===categoryId)
        
            const routeToCard = await filterCategoriesRoute(categoryId)
            const dim =  await dimensionOf('./'+card.image.path) 
            return res.status(200).json({
                card:{
                    ...card._doc,
                    category,
                    dimensions:dim,
                    routeToCard,
                    similarCards
                },
                message:'Operation succeed '
            })
        }
    }
    return res.status(200).json({
        card:null,
        message:'no card to display'
    })   
}


//! ----- GROUPE ALL CARDS BY IN 3 BY SUBCATEGORIES ----------
exports.getAllCardsBySubCategories = async (req, res, next) => {
        const { type } = req.query

        const options = {
            allowDiskUse: false
        };

        const pipeline = [
            {
                $match: {
                   $and:[
                       type?{cardType: type}:{},
                       {deleted:false}
                   ]
                }
            },
            {
                $lookup: {
                    from: "subcategories",
                    localField: "subCategory",
                    pipeline: [
                        {
                            $project: {
                                _id: "$_id",
                                title: "$title"
                            }
                        }
                    ],
                    foreignField: "_id",
                    as: "subCategory"
                }
            }, 
            {
                $lookup: {
                    from: "images",
                    localField: "image",
                    pipeline: [
                        {
                            $project: {
                                "path": "$path"
                            }
                        }
                    ],
                    foreignField: "_id",
                    as: "image"
                }
            }, 
            {
                $project: {
                    _id: "$_id",
                    views: "$views",
                    subCategory: "$subCategory",
                    title: "$title",
                    image: {
                        $arrayElemAt:["$image.path",0.0]
                    }
                }
            }, 
            {
                $unwind: {
                    path: "$subCategory"
                }
            }, 
            {
                $group: {
                    _id: {
                        id: "$subCategory._id",
                        title: "$subCategory.title"
                    },
                    cards: {
                        $push: {
                            _id: "$_id",
                            title: "$title",
                            image: "$image"
                        }
                    }
                }
            }, 
            {
                $project: {
                    _id: "$_id.id",
                    title: "$_id.title",
                    cards: {$slice:["$cards",3]}
                }
            }
        ];
        const results = await Card.aggregate(pipeline).option(options)
 
        if(!results){
            return res.status(500).json({
                errors:{message:'Error while retreiving all sub-categories'},
                data:null,
            })
        }
        return res.status(200).json({
            data:results,
        })
}

//! ----- RETRIEVE ALL CARDS ----------
exports.getAllCards = async (req, res, next) => {
    const { query } = req
    const page = Number(query.page)||1;
    const size = Number(query.size)||24;


    const { limit,offset } = getPagination(page,size);
    const {category,subCategory,subChild,sort,count } = query

    const isPopular = sort==='popular'?true:false;
    let isIdValid = true

    const QueryBy = ()=>{
        if(category && !subCategory && !subChild){
            
            isIdValid = isValidID(category)
            return {category:category}
        }
        if(subCategory && !category && !subChild){
        
            isIdValid = isValidID(subCategory)
            return {subCategory:subCategory}
        }
        if(subChild && !category && !subCategory){
            
            isIdValid = isValidID(subChild)
            return {subCategoryChildren:subChild}
        }
        return {}
    }; 

    const pipeline =[
        {
            "$lookup": {
                "from": "images",
                "localField": "image",
                "pipeline": [
                    {
                        "$project": {
                            "_id": "$_id",
                            "path": "$path"
                        }
                    }
                ],
                "foreignField": "_id",
                "as": "image"
            }
        }, 
        {
            "$facet": {
                "cards": [
                    {
                        "$match": {
                            "$and": [
                                {
                                    "cardType": {
                                        "$eq": "card"
                                    }
                                },
                                {
                                    "deleted": false
                                }
                            ]
                        }
                    },
                    {
                        "$sort": {
                            "views": -1.0
                        }
                    },
                    {
                        "$limit": count?Number(count):25
                    },
                    {
                        "$project": {
                            "_id": {
                                "$concat": [
                                    {
                                        "$toString": {
                                            "$last": "$relatedCategories"
                                        }
                                    },
                                    "-",
                                    {
                                        "$toString": "$_id"
                                    }
                                ]
                            },
                            "ititle": "$title",
                            "slug": "$slug",
                            "image": {
                                "$arrayElemAt": [
                                    "$image.path",
                                    0.0
                                ]
                            },
                            orientation:"$orientation"
                        }
                    }
                ],
                "invitations": [
                    {
                        "$match": {
                            "$and": [
                                {
                                    "type": {
                                        "$eq": "invitation"
                                    }
                                },
                                {
                                    "deleted":false
                                }
                            ]
                        }
                    },
                    {
                        "$sort": {
                            "views": -1.0
                        }
                    },
                    {
                        "$limit": count?Number(count):25
                    },
                    {
                        "$project": {
                            "_id": {
                                "$concat": [
                                    {
                                        "$toString": {
                                            "$last": "$relatedCategories"
                                        }
                                    },
                                    "-",
                                    {
                                        "$toString": "$_id"
                                    }
                                ]
                            },
                            "ititle": "$title",
                            "slug": "$slug",
                            "image": {
                                "$arrayElemAt": [
                                    "$image.path",
                                    0.0
                                ]
                            },
                            orientation:"$orientation"
                        }
                    }
                ]
            }
        }
    ]

    /// get popular cards, either by card and invitation
    if(isPopular){
        const results = await Card.aggregate(pipeline).option(options)
        if(!results){
            return res.status(500).json({
                data:null,
                message:'Error while retreiving data from database'
            })
        } 
        return res.status(200).json({
            ...results[0]
        })
    }


    const queries =  QueryBy();
    
    if(!isIdValid){
        return res.status(200).json({
            cards:[],
            currentPage:0,
            hasNextPage:false,
            hadPreviousPage:false,
            totalPages:null,
            prevPage:null,
        })
    }

    const results = await Card.paginate({deleted:false,...queries},{offset,limit,sort:{createdAt:-1},populate:[
        {path:"image",model:'Image'},
        {path:"tags",select:"name",model:'Tag',match:{deleted:false}},
        {path:"subCategory",select:"name customId",model:'SubCategory',match:{deleted:false}},
        {path:"subCategoryChildren",select:"name customId",model:'ChildrenSubCategory',match:{deleted:false}},
        {path:"category",select:"name customId",model:'Category',match:{deleted:false}},
        {path:"createdBy",select:"userName",model:'User',match:{deleted:false}}
    ]})


    const cards = results.docs.map(card=>{({...card._doc,_id:card.relatedCategories[card.relatedCategories.length-1]+'-'+card._id}) })
    return res.status(200).json({
        cards:cards,
        currentPage:results.page,
        hasNextPage:results.hasNextPage,
        hadPreviousPage:results.hasPrevPage,
        totalPages:results.totalPages,
        prevPage:results.prevPage,
        totalResults:results.totalDocs
    })       
        
}


exports.onView = async (req, res, next) => {
    const id = req.body.cardId;
    const cardId= id.split('-')[1];
    const publicSession = req.session.get('public')

    if(!publicSession){
        const viewedCards = [cardId];
        req.session.set("public", {viewedCards});
        await req.session.save();
        const savedCard = await Card.findOneAndUpdate({_id:cardId},{$inc: {views:1}})

        if(!savedCard){
            return res.status(500).json({
                card:null,
                errors:{message:'Error while updating the Number of Views'}
            })
        }
        return res.status(200).json({
            card:savedCard,
            message:'Number of views updated sucessfully'
        })
    }

    if(publicSession){
        if(!publicSession.viewedCards){

            req.session.set("public", {...publicSession,viewedCards:[cardId]});
            await req.session.save();
            const savedCard = await Card.findOneAndUpdate({_id:cardId},{$inc: {views:1}})

            if(!savedCard){
                return res.status(500).json({
                    card:null,
                    errors:{message:'Error while updating the Number of views'}
                })
            }
            return res.status(200).json({
                card:savedCard,
                message:'Number of views updated sucessfully'
            })
        }else{
            
            const isCardviewed= publicSession.viewedCards.includes(cardId)

            if (!isCardviewed){
                req.session.set("public", {...publicSession,viewedCards:[...publicSession.viewedCards,cardId]});
                await req.session.save();
                const savedCard = await Card.findOneAndUpdate({_id:cardId},{$inc: {views:1}})

                if(!savedCard){
                    return res.status(500).json({
                        card:null,
                        errors:{message:'Error while updating the Number of views'}
                    })
                }
                return res.status(200).json({
                    card:savedCard,
                    message:'Number of views updated sucessfully'
                })
            }

            return res.status(200).json({
                message:'Number of views updated sucessfully'
            })
        }     
    }

}


exports.onDownload = async (req, res, next) => {
    const cardId = req.body.cardId;
    const publicSession = req.session.get('publicSession')

    if(!publicSession){
        const downloadedCards = [cardId];
        req.session.set("publicSession", {downloadedCards});
        await req.session.save();
        const savedCard = await Card.findOneAndUpdate({_id:cardId},{$inc: {downloads:1}})

        if(!savedCard){
            return res.status(500).json({
                card:null,
                errors:{message:'Error while updating the Number of downloads'}
            })
        }
        return res.status(200).json({
            card:savedCard,
            message:'Number of downloads updated sucessfully'
        })
    }

    if(publicSession){
        if(!publicSession.downloadedCards){
            req.session.set("publicSession", {...publicSession,downloadedCards:[cardId]});
            await req.session.save();
            const savedCard = await Card.findOneAndUpdate({_id:cardId},{$inc: {downloads:1}})
            if(!savedCard){
                return res.status(500).json({
                    card:null,
                    errors:{message:'Error while updating the Number of downloads'}
                })
            }
            return res.status(200).json({
                card:savedCard,
                message:'Number of downloads updated sucessfully'
            })
        }else{
            
            const isCardDownloaded = publicSession.downloadedCards.includes(cardId)

            if (!isCardDownloaded){
                req.session.set("publicSession", {...publicSession,downloadedCards:[...publicSession.downloadedCards,cardId]});
                await req.session.save();
                const savedCard = await Card.findOneAndUpdate({_id:cardId},{$inc: {downloads:1}})

                if(!savedCard){
                    return res.status(500).json({
                        card:null,
                        errors:{message:'Error while updating the Number of downloads'}
                    })
                }
                return res.status(200).json({
                    card:savedCard,
                    message:'Number of downloads updated sucessfully'
                })
            }

            return res.status(200).json({
                message:'Number of downloads updated sucessfully'
            })
        }     
    }

}


exports.onSearch = async (req, res, next) => {
    const { query} = req
    const {q,type } = query
    const page = Number(query.page)||1;
    const size = Number(query.size)||10;


    const { limit,offset } = getPagination(page,size);
    const { myQuery }  = queryBy(type);
    const  escapedQ = q.replace(/[-\/\\^$*+?._()|[\]{}]/g, '\\$&')
    const  newQ = new RegExp( `${escapedQ}`,'i');
    const  queryLength = new RegExp('^(?![-._])([a-zA-Z _.-]{3,})');

    if(!queryLength.test(q)){
        return res.status(200).json({
            cards:[],
            currentPage:0,
            hasNextPage:false,
            hadPreviousPage:false,
            totalPages:null,
            prevPage:null,
            nextPage:null
        })
    }
    const pipeline = [
        {
            "$match": {
                title:{$regex:newQ}
            }
            
        }, 
        {
            "$match": myQuery
        }, 
        {
            "$lookup": {
                "from": "images",
                "localField": "image",
                "pipeline": [
                    {
                        "$project": {
                            "_id": "$_id",
                            "path": "$path"
                        }
                    }
                ],
                "foreignField": "_id",
                "as": "image"
            }
        }, 
        {
            "$project": {
                "_id": {
                    "$concat": [
                        {
                            "$toString": {
                                "$last": "$relatedCategories"
                            }
                        },
                        "-",
                        {
                            "$toString": "$_id"
                        }
                    ]
                },
                "title": "$title",
                "image": {
                    "$arrayElemAt": [
                        "$image",
                        0.0
                    ]
                },
                "collectionName": "$collectionName"
            }
        }, 
        {
            "$facet": {
                "data": [
                    {
                        "$skip": offset
                    },
                    {
                        "$limit": limit
                    }
                ],
                "metadata": [
                    {
                        "$count": "total"
                    }
                ]
            }
        }, 
        {
            "$project": {
                "data": 1.0,
                "totalPages": {
                    "$ceil": {
                        "$divide": [
                            {
                                "$arrayElemAt": [
                                    "$metadata.total",
                                    0.0
                                ]
                            },
                            limit
                        ]
                    }
                },
                "currentPage": {
                    "$cond": [
                        {
                            "$arrayElemAt": [
                                "$metadata.total",
                                0.0
                            ]
                        },
                        {"$add": [
                            {
                                "$divide": [
                                    offset,
                                    limit
                                ]
                            },
                            1.0
                        ]},
                        0
                    ]
                }
            }
        }, 
        {
            "$project": {
                "data": 1.0,
                "totalPages": "$totalPages",
                "currentPage": "$currentPage",
                "hasNextPage": {
                    "$gt": [
                        "$totalPages",
                        "$currentPage"
                    ]
                },
                "hadPreviousPage": {
                    "$and": [
                        {
                            "$gt": [
                                "$currentPage",
                                1.0
                            ]
                        },
                        {
                            "$gte": [
                                "$totalPages",
                                "$currentPage"
                            ]
                        }
                    ]
                },
                "nextPage": {
                    "$cond": [
                        {
                            "$or": [
                                {
                                    "$eq": [
                                        "$totalPages",
                                        "$currentPage"
                                    ]
                                },
                                {
                                    "$gt": [
                                        "$currentPage",
                                        "$totalPages"
                                    ]
                                }
                            ]
                        },
                        null,
                        {
                            "$add": [
                                "$currentPage",
                                1.0
                            ]
                        }
                    ]
                },
                "prevPage": {
                    "$cond": [
                        {
                            "$and": [
                                {
                                    "$gt": [
                                        "$currentPage",
                                        1.0
                                    ]
                                },
                                {
                                    "$gte": [
                                        "$totalPages",
                                        "$currentPage"
                                    ]
                                }
                            ]
                        },
                        {
                            "$subtract": [
                                "$currentPage",
                                1.0
                            ]
                        },
                        null
                    ]
                }
            }
        },
    ];
    
    var options = {
        allowDiskUse: false
    };
    const results = await Card.aggregate(pipeline).option(options)
        return res.status(200).json({
            cards:results[0].data,
            currentPage:results[0].currentPage,
            hasNextPage:results[0].hasNextPage,
            hadPreviousPage:results[0].hadPreviousPage,
            totalPages:results[0].totalPages,
            prevPage:results[0].prevPage,
            nextPage:results[0].nextPage
        })
}


//! ----- CREATE A CARD ----------
exports.createCard = async (req, res, next) => {
    const currentUserId = req.body.currentUserId
    const title = req.body.title.trim();
    const type = req.body.type;
    const slug = req.body.slug.trim();
    const description = req.body.description.trim();
    const tags = req.body.tags?JSON.parse(req.body.tags):[];
    const cardImage = req.body.image;
    const orientation = req.body.orientation;
    const relatedCategories = req.body.relatedCategories?JSON.parse(req.body.relatedCategories):[];
    const categoryIds = req.body.category?JSON.parse(req.body.category):[];
    const subCategoryIds = req.body.subCategory?JSON.parse(req.body.subCategory):[];
    const subCategoryChildrenIds = req.body.subCategoryChildren?JSON.parse(req.body.subCategoryChildren):[];

 
    let isError = [];


    if(categoryIds){
        const category = await Category.find().where('_id').in(categoryIds);

        if(category.length!==categoryIds.length){
            isError.push({categories:'One or multiple Categories are not valid'})
        }
    }

    if(subCategoryIds){
        const subCategory = await SubCategory.find().where('_id').in(subCategoryIds);

        if(subCategory.length!==subCategoryIds.length){
            isError.push({subCategory:'One or multiple sub-Categories selected are not valid'})
        }
    }


    if(subCategoryChildrenIds){
        const subCategoryChild = await SubCategoryChild.find().where('_id').in(subCategoryChildrenIds);

        if(subCategoryChild.length!==subCategoryChildrenIds.length){
            isError.push({subCategoryChildren:'One or multiple sub-category children selected are not valid'})
        }
    }


    if(tags.length){
        const tagsInDB = await Tag.find({_id: { $in: tags } });
        if(tags.length!==tagsInDB.length){
            isError.push({Tags:'one or multiple tags is not valid'})
        }
    }

    
    if(!valideOrientation.includes(orientation)){
        isError.push({cardOrientation:'card orientation is not valid'})
    }
    
    isError = [
        ...isError,
        await validate(title,titleProps),
        await validate(slug,slugProperties),
    ].filter(e=>e!==true);


    
    if(isError.length){
        return res.status(500).json({
            errors:isError,
            card:null,
        })
    }


    
    function capitalize(str) {
        return str.charAt(0).toUpperCase() + str.slice(1);
    }
    const newTitle= title.trim().split(' ').map(capitalize).join(' ');

    

    const newSlug= slug.trim().split(' ').join('-').toLowerCase();


    const card = new Card({
        title:newTitle,
        slug:newSlug,
        description:description,
        tags:tags,
        cardType:type,
        image:cardImage,
        orientation:orientation,
        status:true,
        relatedCategories:[...new Set(relatedCategories)],
        category:categoryIds,
        subCategory:subCategoryIds,
        subCategoryChilden:subCategoryChildrenIds,
        createdBy:currentUserId
    })


    const savedCard = await card.save();
    if(savedCard){
        return res.status(201).json({
            card:savedCard,
            message:'Card created successfully'
        })
    }
    return res.status(500).json({
        card:null,
        errors:{message:'Error while saving the new card'}
    })
}

//! ----- EDIT A CARD ----------
exports.updateCard = async (req, res, next) => {
    const currentUserId=req.body.currentUserId;
    const cardId= req.params.id;
    const title = req.body.title.trim();
    const slug = req.body.slug.trim();
    const description = req.body.description.trim();
    const tags = req.body.tags?JSON.parse(req.body.tags):[];
    const relatedCategories = req.body.relatedCategories?JSON.parse(req.body.relatedCategories):[]
    const cardImage = req.body.image;
    const orientation = req.body.cardOrientation;
    const status = isBoolean(req.body.status.trim());

    const categoryIds = req.body.category?JSON.parse(req.body.category):[];
    const subCategoryIds = req.body.subCategory?JSON.parse(req.body.subCategory):[];
    const subCategoryChildrenIds = req.body.subCategoryChildren?JSON.parse(req.body.subCategoryChildren):[];


    let isError = []
    

    if(!valideOrientation.includes(orientation)){
        isError.push({cardOrientation:'card orientation is not valid'})
    }


    if(categoryIds){
        const category = await Category.find().where('_id').in(categoryIds);

        if(category.length!==categoryIds.length){
            isError.push({category:'One or multiple Categories are not valid'})
        }
    }

    if(subCategoryIds){
        const subCategory = await SubCategory.find().where('_id').in(subCategoryIds);

        if(subCategory.length!==subCategoryIds.length){
            isError.push({subCategory:'One or multiple sub-Categories selected are not valid'})
        }
    }


    if(subCategoryChildrenIds){
        const subCategoryChild = await SubCategoryChild.find().where('_id').in(subCategoryChildrenIds);

        if(subCategoryChild.length!==subCategoryChildrenIds.length){
            isError.push({subCategoryChildren:'One or multiple sub-categories children selected are not valid'})
        }
    }


    if(tags){
        const tagsInDB = await Tag.find({ _id: { $in: tags } });
        
        if(tags.length!==tagsInDB.length){
            isError.push({Tags:'one or multiple tags is not valid'})
        }
    }
    
    
    isError = [
        ...isError,
        await validate(title,titleProps),
        await validate(slug,slugProperties),
        await validate(status,statusProps),
    ].filter(e=>e!==true);
    
    if(isError.length){
        return res.status(500).json({
            errors:isError,
            message:'Invalid Input!'
        })
    }



    
    const card = await Card.findById(cardId);
    if(!card){
        return res.status(404).json({
            errors:{message:'Card does not exist'},
            card:null
        })
    }


    function capitalize(str) {
        return str.charAt(0).toUpperCase() + str.slice(1);
    }
    const newTitle= title.trim().split(' ').map(capitalize).join(' ');
    const newSlug= slug.trim().split(' ').join('-').toLowerCase();

    card.title = newTitle;
    card.slug = newSlug;
    cardImage?card.image = cardImage:null
    card.description = description;
    card.category = categoryIds ;
    card.subCategory = subCategoryIds;
    card.subCategoryChildren = subCategoryChildrenIds;
    card.relatedCategories = [...new Set(relatedCategories)];
    card.tags = tags;
    card.orientation = orientation;
    card.status = status;
    card.updatedBy= currentUserId


    const updatedCard = await card.save()


    if(updatedCard){
        return res.status(200).json({
            data:updatedCard,
            message:'Card updated successfully'
        })
    }
    return res.status(500).json({
        errors:{message:"Error while editing the card"}
    })
    
}

//! ----- DELETE A CARD ----------
exports.deleteCard = async (req, res, next) => {
    const currentUserId = req.body.currentUserId;
    const cardId = req.params.id;

    const currentUser = await User.findById(currentUserId)
    if(authorities.includes(currentUser.authority)){
        const card = await Card.findByIdAndUpdate({_id:cardId},{deleted:true,deletedBy:currentUser._id})
        if(!card){
            return res.status(500).json({
                errors:{message:'Error while deleting the card'}
            })
        }

        await Image.findByIdAndUpdate({_id:card.image},{deleted:true})

        return res.status(200).json({
            data:card,
            message:'Card deleted successfully'
        })
    }

    return res.status(403).json({
        errors:{message:'Not authorised to delete a card'}
    })
}