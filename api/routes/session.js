const express = require("express");
const router = express.Router();

const {WithuAuthSession} = require("../utils/session")



router.get("/",WithuAuthSession(async (req,res)=>{
    if(!req.session.get('userSession')){
        return res.status(200).json({
            session:null,
            message:'you are not sign in',
            status:401
        })
    }
    return res.status(200).json({
        session:req.session.get('userSession'),
        status:200
    })
}));

module.exports = router;