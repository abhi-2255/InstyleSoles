const User = require("../models/userModel")
const bcrypt = require('bcrypt')
const otpGenerator = require('otp-generator')
const nodeMailer = require('nodemailer')
const Product = require("../models/productModel")
const Category = require("../models/categoryModel")
// const { getMaxListeners } = require("nodemailer/lib/xoauth2")






const userHome = async (req, res) => {
   try {
      const product = await Product.find({isblocked:false})
      console.log('product1',product);
      
      if (req.session.user) {
         console.log('entry');
         
         const products = await Product.find({isblocked:false}).populate('category')
         const newProducts = await Product.find({isblocked:false})
   
         const categories = await Category.find({isblock:false})
   
         let user = await User.findOne({_id: req.session.user})
   
         if(user && user.isblocked === true){
            console.log("userblockesd",);
            
            const filteredProducts = products.filter((product)=>{
               const category = categories.find((cat)=>{
                  cat._id.toString() === product.category._id.toString()
               })
               return category && category.isblock == true
            })
            console.log('filterProducts',filteredProducts);

            
            console.log('session',user,filteredProducts,session,newProducts)
            let session = req.session.user
            res.render('user/userHome',{
               user,
               product: filteredProducts,
               session,
               newProducts
            })
         // res.render('user/userHome', { user: req.session.user })
      } else {
         console.log('product',product);
         res.render('user/userHome',{user,product})
      }
   }else{
      res.render('user/userHome',{product})
   }
}
   catch (err) {
      console.log('Error in Home Page', err)
   }
}



const transport = nodeMailer.createTransport({
   host: "smtp.gmail.com",
   port: 587,
   secure: false,
   requireTLS: true,
   auth: {
      user: 'abhinandpv820@gmail.com',
      pass: 'ciukdcpbjbatcirr',
   },
   tls: {
      rejectUnauthorized: false
   }
})




const viewuserLogin = async (req, res) => {
   try {
      res.render('user/userLogin')
   }
   catch (err) {
      console.log('Login Error---', err)
   }
}

const loginPost = async (req, res) => {
   try {
      const { email, password } = req.body
      const userData = await User.findOne({ email })
      console.log('userData',userData);
      
      
      if(userData){  
         if (userData.isAdmin === true) {
            res.redirect('/login')
         } else {
            if (!userData || userData.isblocked === true) {
               res.redirect('/login')
            } else {
               console.log("Matching....")
               const matchPassword = await bcrypt.compare(
                  password,
                  userData.password
               )
               req.session.user = userData
               console.log('user',req.session.user)
               console.log("Matched?-->", matchPassword)
               if (!matchPassword) {
                  res.render('user/userLogin', { message: 'Wrong Password' })
               } else {
                  res.redirect('/')
               }
            }
         }
      }
   } catch (err) {
      console.log('Login Error', err)
   }
}

const forgotGet = async (req, res) => {
   try {
     console.log("get");
     if (req.session.message) {
       req.session.message = null;
       res.render("User/forgotPassword", { message: "not registerd email" });
     } else {
       res.render("User/forgotPassword", { message: "" });
     }
   } catch (error) {
     console.log(error);
     res.status(500).json({error:'Internal Server Error'})
 
   }
 };
 
 const forgotPost = async (req, res) => {
   try {
     console.log('getpost');
     const { email } = req.body;
     const emailData = await User.findOne({ email: email });
     console.log(emailData);
     if (!emailData) {
       req.session.message = true;
       return res.redirect("/forgotPassword");
     }
     req.session.email = emailData.email;
     console.log(req.session.email + emailData.email);
     const link = "http://localhost:3000/resetPassword";
     console.log(link);
 
     // Send email
     const transporter = nodeMailer.createTransport({
      host: "smtp.gmail.com",
      port: 587,
      secure: false,
      requireTLS: true,
      auth: {
         user: 'abhinandpv820@gmail.com',
         pass: 'ciukdcpbjbatcirr',
      },
      tls: {
         rejectUnauthorized: false
      }
     });
 
     const mailOptions = {
       from: 'instylesoles@gmail.com',
       to: emailData.email,
       subject: "Password Reset Link",
       text: `Click the following link to reset your password: ${link}`,
     };
 
     transporter.sendMail(mailOptions, (error, info) => {
       if (error) {
         console.log('errr',error);
         return res.status(500).send("Internal Server Error");
       }
       console.log("Email sent: " + info.response);
       if(info){
         return res.redirect("/resetPassword");

       }
     });
   } catch (error) {
     console.log(error);
     res.status(500).json({error:'Internal Server Error'})
 
   }
 };
 
 const resetGet = async (req, res) => {
   try {
      console.log('req.session',req.session);
      
     console.log(req.session.email + "kkkjjj");
     if (req.session.email) {
       res.render("user/resetPassword");
     } else {
       console.log("not working");
       res.redirect("/");
     }
   } catch (error) {
     res.status(500).json({error:'Internal Server Error'})
     
   }
 };
 
 const resetPost = async (req, res) => {
   try {
      console.log('req.session in post',req.session);
      console.log(req.session.email)
     const userData = await User.findOne({ email: req.session.email });
   
     console.log("User Data IS" + userData);
     console.log('req.body',req.body.newPassword);
     const userNewpassword = req.body.newPassword;
     if(req.body.newPassword == req.body.cPassword){
     const hashedpassword = await bcrypt.hash(userNewpassword,10);
     console.log(hashedpassword);
 
     console.log("userdataPwd" + userData.password);
     userData.password = hashedpassword;
     userData.save();
 
     req.session.exist = null;
     res.redirect("/login");
     }
   } catch (error) {
     res.status(500).json({error:'Internal Server Error'})
     
   }
 };

const viewuserSignup = async (req, res) => {
   try {
      res.render('user/userSignup')
   }
   catch (err) {
      console.log('Signup Error', err)
   }
}



const signup = async (req, res) => {
   try {
      const { fname, lname, mob, email, pwd, cPwd } = req.body
      console.log(fname);

      console.log(pwd, '  ', cPwd);
      if (pwd === cPwd) {
         console.log('signup entry');
         const checkEmailExists = await User.findOne({ email: email })
         console.log("checkEmailExists--", checkEmailExists)

         if (checkEmailExists) {
            return res.json({ Error: true, message: 'Email already Exists' })
         }
         const hashPassword = await bcrypt.hash(pwd, 10)
         console.log(hashPassword);
         const signupData = {
            firstName: fname,
            lastName: lname,
            mobile: mob,
            email,
            password: hashPassword

         }
         console.log(signupData);
         const otp = otpGenerator.generate(6, {
            digits: true,
            upperCaseAlphabets: false,
            lowerCaseAlphabets: false,
            specialChars: false
         })
         console.log('OTP is', otp);



         const mailOptions = {
            from: 'instylesoles@gmail.com',
            to: email,
            subject: 'OTP Verification',
            text: `Your OTP is ${otp}`
         }

         transport.sendMail(mailOptions, (err) => {
            if (err) {
               console.log(err.message)
               console.log('mailOptions=', mailOptions);
            } else {
               console.log('otp', otp);
               req.session.otp = otp
               req.session.userData = signupData
               console.log("mail sess",req.session);

               console.log('Mail sent successfully')
               res.status(200).json({success:true, message: 'mail send sucessfully' })
            }
         })
      } else {
         res.json('Password is not matching')
      }
   } catch (err) {
      console.log(err, 'Error')

   }

}


const loadOtp = async (req, res) => {

   try {
      console.log('otpPage')
         res.render('user/otp')
   }

    catch (error) {
      console.log(error.message)
   }

}

const OTP_EXPIRY_TIME = 5 * 60 * 1000
const verifyOtp = async (req, res) => {
   try {
      console.log('body',req.body)
      const otpFrom = req.body.otp
      const { userData, otp, otpGeneratedTime } = req.session
      const currentTime = new Date().getTime()

      if(currentTime - otpGeneratedTime > OTP_EXPIRY_TIME){
         req.session.message = "OTP has expired. Please request a new one."
         return res.redirect('/signup')
      }
      console.log(req.session)
      console.log("USERDATA", userData)
      console.log('OTP',otp);
      console.log("Received OTP", otpFrom);

      if (userData && otpFrom.toString() === otp.toString()) {
         const user = new User({
            firstName: userData.firstName,
            lastName: userData.lastName,
            mobile: userData.mobile,
            email: userData.email,
            password: userData.password,
            isVerified: true
         })
         await user.save()

         req.session.userData = null
         req.session.otp = null
         req.session.otpGeneratedTime = null

         return res.status(200).json({message: 'OTP verified successfully!'})
      } else {
         return res.json({message: 'Wrong OTP! Please try Again.'})
      }
   } catch (error) {
      console.log(error.message)
      return res.status(500).json({ message:'An error occured.Please try again.'})
   }
}

const resendOtp = (req, res) => {
   try {
      if (req.session.userData) {
         const currentTime = new Date().getTime()

         if(currentTime - req.session.otpGeneratedTime > OTP_EXPIRY_TIME){
            req.session.otp = null
            req.session.otpGeneratedTime = null
         }
         console.log('Not sent')
         const recipientEmail = req.session.userData
         console.log("recepient", recipientEmail);
         const newOtp = otpGenerator.generate(6, {
            digits: true,
            upperCaseAlphabets: false,
            lowerCaseAlphabets: false,
            specialChars: false
         })
         console.log('NewOtp', newOtp);
         const email = recipientEmail.email

         const mailOptions = {
            from: 'instylesoles@gmail.com',
            to: email,
            subject: 'OTP Verification',
            text: `Your OTP is ${newOtp}. Valid for 5 minutes`
         }

         transport.sendMail(mailOptions, (err) => {
            if (err) {
               console.log(err.message)
               console.log('mailOptions=', mailOptions);
            } else {
               console.log('mailOptions=', mailOptions);
               req.session.otp = newOtp
               req.session.otpGeneratedTime = currentTime
               res.render('user/otp')
            }
         })
         // req.session.otp = newOtp
         // res.send('OTP Sent Successfully')

      } else {
         res.send('Failed to Resend OTP')
      }
   } catch (error) {
      console.log(error.message)
   }
}



const userLogout = (req, res) => {
   try {
      req.session.user = null
      res.redirect('/login')
   }
   catch (error) {
      console.log(error.message)
   }
}



module.exports = {
   userHome,
   viewuserLogin,
   forgotGet,
   forgotPost,
   resetGet,
   resetPost,
   viewuserSignup,
   signup,
   loadOtp,
   verifyOtp,
   resendOtp,
   loginPost,
   userLogout,
}