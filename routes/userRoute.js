
const express = require('express')
const routes = express.Router()
const userController = require('../controllers/userController')
const userMiddleware = require('../middleware/userAuth')
const shopController = require('../controllers/shop')
const passport = require("passport")



routes.get('/login', userMiddleware.isLogout , userController.viewuserLogin)
routes.post('/login',userMiddleware.isLogout,userController.loginPost)
routes.get('/logout',userController.userLogout)
routes.get('/forgotPassword',userController.forgotGet)
routes.post('/forgotPassword',userController.forgotPost)
routes.get('/resetPassword',userController.resetGet)
routes.post('/resetPassword',userController.resetPost)
routes.get('/signup',userController.viewuserSignup)
routes.post('/signup',userController.signup)
routes.get('/otp',userController.loadOtp)
routes.post('/otp',userController.verifyOtp)
routes.get('/resendotp', userController.resendOtp)
routes.post('/resendotp',userController.resendOtp)
routes.get('/',userController.userHome)





// shop 
routes.get('/shop',shopController.shopGet)
routes.get('/productdetail/:id',(req,res,next)=>{
    console.log("hi");
    next()
},shopController.productDetailsGet)



//google authentication 
routes.get('/login/google',passport.authenticate('google', { scope: ['profile', 'email'] }));
routes.get('/google/callback', passport.authenticate('google',{ failureRedirect: '/login' }),
    (req, res) => {
        console.log('authUser',req.user);
        
        req.session.user = req.user
        req.session.tempSaver = req.user.email
        res.redirect('/');
    });


module.exports = routes