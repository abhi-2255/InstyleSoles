
const Product = require('../models/productModel')
const Category = require('../models/categoryModel');
const name  = require('ejs');
const mongoose  = require('mongoose');
const path = require('path');
const fs = require('fs')
const sharp = require('sharp');
const multer = require('multer');
const upload = require('../helper/multer')




const productGet = async (req, res) => {
  const PAGE_SIZE = 3;
  try {
    const product = await Product
      .find()
      .populate("category")
    console.log(product);
    res.render("admin/product", { product });
  } catch (error) {
    console.log(error);
    res.status(500).send("Internal Server Error");
  }
};

const addProductGet = async (req, res) => {
  try {
    const category = await Category.find({});
    console.log(category);
    res.render("admin/addProduct", { category });
  } catch (error) {
    console.log(error);
  }
};



const addProductPost = async (req, res) => {
  try {
    const productData = req.body;
    console.log('productData', productData);
    console.log("request files",req.files);
    

    if (!productData) {
      return res.status(400).json('Product data is missing')
    }
      const {
        title,
        color,
        size,
        description,
        category,
        price,
        stock
      } = productData;

      if(req.files.length < 3){
        return res.status(400).json({error: "Minimum 3 images are required"})
      }

      // Define the images directory relative to your project root
      const imagesDir = path.join(__dirname, '../public/images');
      console.log('imgdir:',imagesDir);
      

      // Ensure the directory exists
      if (!fs.existsSync(imagesDir)) {
        fs.mkdirSync(imagesDir, { recursive: true }); // Creates the directory if it doesn't exist
      }

      let images = [];

      await Promise.all(req.files.map(async(file)=>{
        const filename = `${Date.now()}-${file.originalname}`;
        const filePath = path.join(__dirname, '../public/images',filename);

      try {
        console.log('filepath',filePath)
        // Crop and resize image using sharp
        await sharp(path.join(__dirname,'../public/images'))
        .extract({ left: x, top: y, width: width, height: height })
        .toFile(filePath)
        images.push(filename)
        
      } catch(sharpError){
        console.error(`Error processing image ${file.originalname}:`,sharpError)
        throw new Error(`Failed to process image ${file.originalname}`)
      }
      })) 
        
      console.log('images',images)

      await Product.create({
        name: title,
        color,
        size,
        description,
        category,
        price: parseFloat(price),
        stock,
        image: images // Save array of image filenames
      });

      res.redirect("/admin/product");
    } catch(error) {
      console.error('Error in addprod',error)
      res.status(500).json({error:"Internal Server Error"})
    }
};




const blockUnblockProd = async (req, res) => {
  try {
    const id = req.query.id;
    console.log("product ID:", id);
    const data = await Product.findById(id);

    if (!data) {
      return res
        .status(404)
        .json({ status: false, message: "Product Page not found" });
    }

    const publish = !data.isblocked;

    const updatedProduct = await Product.findByIdAndUpdate(id, {
      $set: {
        isblocked: publish,
      },
    });

    if (!updatedProduct) {
      return res.status(500)
        .json({ status: false, message: "Failed to update product" });
    }

    res.status(200).json({ status: true });
  } catch (error) {
    console.log(error);
    res.status(500).json({ status: false, message: "Internal Server Error" });
  }
};

const productEditGet = async (req, res) => {
  try {
    const productId = req.params.id;
    const product = await Product.findOne({ _id: productId }).populate('category');
    const category = await Category.find({})
    console.log("product", product);

    if (!product) {
      return res.status(404).render("error404");
    }
    console.log('product and category',product,category);

    res.render("admin/productEdit", { product, category });
  } catch (error) {
    console.log(error);
    res.status(500).send("Internal Server Error");
  }
};

const productEditPost = async (req, res) => {
  try {
    console.log("req.body", req.body);
    console.log("req.files", req.files);
    // const productId = req.params.id;
    const { productId, name, description,color,size, stock, price, category } = req.body;

    let updatedProductData = {
      name,
      color,
      size,
      description,
      stock,
      price,
      category
    };
    // category instanceof mongoose.Types.ObjectId ? category : null,
    // if(req.files) updatedProductData[image] = req.file.filename 
    if (req.files && req.files.length > 0) {
      const imageFilenames = req.files.map(file => file.filename)
      console.log('filenames', imageFilenames)
      updatedProductData.image = imageFilenames;
       console.log('updatproddata',updatedProductData);
      // Assuming images field stores array of filenames
    }
    console.log("HELLO")
    // console.log("req.file.filename-->"+req.files.filename)
    console.log("updatedProductData-->"+JSON.stringify(updatedProductData));
    console.log('updateProdData',updatedProductData);
    
    const updatedProduct = await Product.findOneAndUpdate(
      { _id: productId },
      { $set: updatedProductData },
      { new: true }
);

    console.log("update Product data", updatedProductData);

    if (!updatedProduct) {
      return res.status(404).render("error404");
    }

    res.redirect("/admin/product");
  } catch (error) {
    console.log(error);
    res.status(500).send("Internal Server Error");
  }
}


const editDeleteImg = async (req, res) => {
  try {
    console.log("img working", req.params.id);
    const id = req.params.id;
    const product = await Product.findById(id);
    if (product.images) {
      // Handle image deletion (remove file from disk, delete from database, etc.)
    }

    const deleteProduct = await Product.findByIdAndDelete(id);
    if (!deleteProduct) {
      return res
        .status(404)
        .json({ status: false, message: "Product not found" });
    }

    res
      .status(200)
      .json({ status: true, message: "Product deleted successfully" });
  } catch (error) {
    console.log(error.message);
    res.status(500).json({ status: false, message: "Internal Server Error" });
  }
};




module.exports = {
  productGet,
  addProductGet,
  addProductPost,
  blockUnblockProd,
  productEditGet,
  productEditPost,
  editDeleteImg
}