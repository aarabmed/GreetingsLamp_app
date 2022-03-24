const express = require("express");
const router = express.Router();
const checkAuth = require("../middlewares/auth");
const uploadImage = require("../middlewares/imageUpload");
const {WithPublicSession} = require("../utils/session");

const  {onSearch,onView,onDownload,getCard,getAllCards,createCard, updateCard,deleteCard, getAllCardsBySubCategories}= require('../controllers/card')


router.get("/", getAllCards);

router.get("/bysub-categories", getAllCardsBySubCategories);

router.get("/search", onSearch);

router.get("/:id", getCard);

router.post("/new", checkAuth,uploadImage('cardImage'), createCard);

router.patch("/views",WithPublicSession(onView));

router.patch("/download",WithPublicSession(onDownload));


router.patch("/:id",checkAuth,uploadImage('cardImage'), updateCard);

router.patch("/delete/:id",checkAuth, deleteCard);

module.exports = router;