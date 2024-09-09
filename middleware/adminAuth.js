const express = require('express')
const User = require('../models/userModel')



const adminAuth = async(req,res,next)=>{
    console.log(req.session);
    if(req.session.admin){
        console.log(req.session.admin);
        const admin=await User.findOne({_id:req.session.admin})
        console.log(admin);
        if(admin){
            next()
        }else{
            res.redirect('/admin/login')
        }  
    }else{
        res.redirect('/admin/login')
    }
}


module.exports = {
    adminAuth
}