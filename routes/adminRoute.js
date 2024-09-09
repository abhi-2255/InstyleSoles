const express = require('express')
const routes = express.Router()
const adminController = require('../controllers/adminController')
const adminMiddleware = require('../middleware/adminAuth')
const adminUserController = require('../controllers/adminUserController')
const categoryController = require('../controllers/categoryController')
const productController = require('../controllers/productController')
const Product = require('../models/productModel')
const upload = require('../helper/multer')




routes.get("/login",adminController.adminLogin)
routes.get("/logout",adminController.adminLogout)
routes.post("/login",adminController.loginPost)
routes.get('/dashboard',adminMiddleware.adminAuth,adminController.adminDashboard)




// Users
routes.get("/user/list",adminMiddleware.adminAuth,adminUserController.userList)
routes.get("/user/blockUnblock",adminMiddleware.adminAuth,adminUserController.blockUnblockUser)



// Product   
routes.get("/product", adminMiddleware.adminAuth, productController.productGet);
routes.get("/addProduct", productController.addProductGet);
routes.post("/addProduct",upload.array("image"),productController.addProductPost);
routes.get("/product/block/unblock", adminMiddleware.adminAuth,productController.blockUnblockProd);
routes.get("/productEdit/:id",adminMiddleware.adminAuth,productController.productEditGet);
routes.post('/productEdit', upload.array('images'),productController.productEditPost);






// Category 
routes.get("/category",adminMiddleware.adminAuth,categoryController.categoryGet);
routes.post('/category',adminMiddleware.adminAuth,upload.single('cat_Img'),categoryController.categoryPost)
routes.get('/categoryEdit',adminMiddleware.adminAuth,categoryController.getEditCategory)
routes.post('/categoryEdit',adminMiddleware.adminAuth,upload.single('catImg'),categoryController.editCategory)
routes.get("/categoryList", adminMiddleware.adminAuth,categoryController.categoryBlock)













module.exports = routes