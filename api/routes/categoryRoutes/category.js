const express = require("express");
const router = express.Router();
const checkAuth = require("../../middlewares/auth");
const uploadImage = require("../../middlewares/imageUpload");
const  {getCategory,getAllCategories,createCategory, updateCategory,deleteCategory}= require('../../controllers/category/category')


router.get("/", getAllCategories);

router.get("/:id", getCategory);

router.post("/new",checkAuth, uploadImage('categoryImage'), createCategory);

router.patch("/:id",checkAuth, uploadImage('categoryImage'), updateCategory);

router.patch("/delete/:id",checkAuth, deleteCategory);


module.exports = router;