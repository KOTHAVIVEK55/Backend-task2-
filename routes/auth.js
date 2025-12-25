const express=require('express');
const router=express.Router();


const {loginfun,signup}=require('../controllers/auth');


router.post('/login',loginfun);
router.post('/signup',signup);





module.exports=router;