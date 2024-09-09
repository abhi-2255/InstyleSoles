const Admin = require('../models/adminModel')
const User = require('../models/userModel')
const bcrypt = require('bcrypt')



const adminDashboard = async (req,res)=>{
    try {
        res.render('admin/adminHome')
    } catch (error) {
        console.log(error.message);
    }
}


const adminLogin = async (req,res) => {
    try {
        if(req.session.admin){
            res.redirect('/admin/dashboard')
        } else {
            res.render('admin/adminLogin', {message:''})
        }
    } catch (error){
        console.log("Error-->"+error.message)
    }
}

const loginPost = async (req,res)=>{
    try {
        const {email,password} = req.body
        console.log(req.body)
        const adminData = await User.findOne({email : email, isAdmin:true})
        console.log(adminData)
        if(!adminData){
            req.session.invalid = true
            return res.redirect('/admin/login')
        } else {
            const passwordMatch = await bcrypt.compare(password,adminData.password)
          if(passwordMatch){
            req.session.admin = adminData._id
            res.redirect('/admin/dashboard')
          }
        }
    } catch (err){
        console.log('Admin Login Error',err)
    }
}


const adminLogout = async (req,res)=>{
    try {
        req.session.admin = null;
        res.redirect('/admin/login')
    } catch (error) {
        console.log(error.message);
    }
}

module.exports = {
    adminLogin,
    loginPost,
    adminDashboard,
    adminLogout
}