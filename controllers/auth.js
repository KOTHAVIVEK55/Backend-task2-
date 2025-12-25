const express=require('express');
const User=require('../models/schema');
const bcrypt = require("bcrypt");
const jwt=require('jsonwebtoken');


async function loginfun(req, res) {
    try {
        const { email, password } = req.body;

        const user = await User.findOne({ email });
        if (!user) {
            return res.status(401).json({ message: "Invalid credentials" });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).json({ message: "Invalid credentials" });
        }

        const token = jwt.sign(
            { id: user._id, email: user.email },
            process.env.JWT_SECRET,
            { expiresIn: "1h" }
        );

        res.cookie("token", token, {
        httpOnly: true,
        maxAge: 60*60*1000 
    });

    return res.redirect("/syntecxhub");


    } catch (error) {
        console.error("Error:", error);
        return res.status(500).json({
            message: "Error in login",
            error: error.message
        });
    }
}


async function signup(req,res){
    try{
        const {username, email, password} = req.body;
        const exists=await User.findOne({
            $or:[{email},{username}]
        })
        if(exists){
            return res.status(404).json({message:"user already exists"});
        }
        const hp=await bcrypt.hash(password,10);
        const newUser = new User({
            username: username,
            email: email,
            password: hp
        });
        await newUser.save();
        return res.status(201).redirect('/syntecxhub');
    }catch(error){
        console.error("Error:", error);
        return res.status(500).json({message:"Error in registration", error: error.message});
    }
}















module.exports={
    loginfun,
    signup,
}