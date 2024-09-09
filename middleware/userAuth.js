const express = require('express')
const User = require('../models/userModel')



const isLogin = async (req,res,next)=>{
    if(req.session.user){
        const user =await User.findOne({_id:req.session.user})
        if(!user || user?.isblocked){
            return res.redirect('/login')
        }
        next()
    } else {
        console.log('entryyyyyyy');
        res.redirect('/login')
    }
}

const isLogout = (req,res,next)=>{
    if(!req.session.user){
        console.log("Inside isLogout")
        next()
    }else{
      return res.redirect('/')
    }
}


module.exports= {
    isLogin,
    isLogout
}