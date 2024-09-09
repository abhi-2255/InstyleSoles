const User = require('../models/userModel')
const Product = require('../models/productModel')
const Category = require('../models/categoryModel')
const mongoose = require('mongoose')




const productDetailsGet = async (req, res)=> {
    try {
        const id = req.params.id
        console.log("id",id);
        
        if(!mongoose.Types.ObjectId.isValid(id)){
            return res.status(400).render('error404')
        }

        const product = await Product.findById({_id: id})
        console.log("product");
        
        if(!product){
            return res.render('error404')
        }
        res.render('user/productDetails',{product})
        
    } catch (error) {
        console.log(error)
        res.status(500).json({error:'Internal Server Error'})
    }
}


const shopGet = async (req, res)=>{

    try {
        const product = await Product.find({isblocked:false})
        console.log(product)
        const categories = await Category.find({isblock:false})

        res.render('user/shop',{
            product,
            categories,
        })
    } catch (error) {
        console.log(error)
        res.status(500).send('Internal Server Error')
        
    }
}

module.exports = {
    productDetailsGet,
    shopGet
}