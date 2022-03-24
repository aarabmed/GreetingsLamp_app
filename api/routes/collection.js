const express = require("express");
const router = express.Router();
const checkAuth = require("../middlewares/auth");
const uploadImage = require("../middlewares/imageUpload");
const  {getCollection,getAllCollections,createCollection, updateCollection,deleteCollection}= require('../controllers/collection')


router.get("/", getAllCollections);

router.get("/:id", getCollection);

router.post("/new",checkAuth, uploadImage('collectionImage'), createCollection);

router.patch("/:id",checkAuth, uploadImage('collectionImage'), updateCollection);

router.patch("/delete/:id",checkAuth, deleteCollection);


module.exports = router;