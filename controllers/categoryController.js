
const Category = require('../models/categoryModel')



const categoryGet = async (req, res) => {
    try {
    
      let message = "";
      if (req.session.duplicateCategory) {
      
        message = "Cannot add multiple  category";
        req.session.duplicateCategory = null;
      }
  
      const category = await Category.find({});
      res.render("admin/category", { category, message });
    } catch (error) {
    
      console.log(error);
      res.status(500).json({error:'Internal Server Error'})
  
    }
  };

  
  const categoryPost =async(req,res)=>{
    try {
      console.log(req.body);
      
      const {catName,description} = req.body
      const image = req.file.filename;
      const data = {
        name: catName,
        description: description,
      }
      console.log(data);
      
        const catData = await Category.create(data);
        console.log("Created",catData)
        if (catData != null) {
          console.log("exrctvbyunimo")
          res.redirect("/admin/category");
        }
      else {
        const catdet = await Category.find({ isListed: 0 });
        res.render("admin/category", {
          data: catdet,
          message: "Category already exists!!",
        });
      }
      
    } catch (error) {
      
    }
  }

  const getEditCategory =async(req,res)=>{
    try {
      const {catId} = req.query
      console.log(catId);
      const getProductById = await Category.findById({_id:catId})
      res.render('admin/editCategory',{
        data: getProductById,
        message: 'Product exists'
      })
    } catch (error) {
      console.error(error)
    }
  }

  const editCategory =async(req,res)=>{
    try {
      console.log(req?.file);
      const { catId ,description,catName,status} = req.body;
      const dataToUpdate = {description,name:catName,status: status === 0 ? false : true}
      console.log(catId,dataToUpdate);
      const getProductById = await Category.findByIdAndUpdate({_id:catId},{$set:dataToUpdate},{new:true})
      console.log(getProductById);
      
    if(getProductById){
      res.redirect('/admin/category')
    } else{
      return res.status(404).render('error404')
    }
      
    } catch (error) {
      console.error(error)
      res.status(500).send('Internal Server Error')
    }
  }

  
  const categoryBlock = async (req, res) => {
    try {
      const id = req.query.id;
      console.log("product ID:", id);
      const data = await Category.findById(id);
  
      if (!data) {
        return res
          .status(404)
          .json({ status: false, message: "Productpage not found" });
      }
  
      const publish = !data.isblock;
  
      const updatedProduct = await Category.findByIdAndUpdate(id, {
        $set: {
          isblock: publish,
        },
      });
  
      if (!updatedProduct) {
        return res
          .status(500)
          .json({ status: false, message: "Failed to update product" })
      }
  
      res.status(200).json({ status: true });
    } catch (error) {
      console.log(error);
      res.status(500).json({ status: false, message: "Internal Server Error" });
    }
  };
  
  
  

  module.exports = {
    categoryGet,
    categoryPost,
    getEditCategory,
    editCategory,
    categoryBlock
  }