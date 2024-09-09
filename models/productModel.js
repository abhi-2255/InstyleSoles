const mongoose = require('mongoose')
const Schema = mongoose

const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  image: {
    type: [String],
    required : true
  },
  color: {
    type: String,
    required: true
  },
  
  size: {
    type: Number,
    required: true
  },

  category: {
    type: Schema.Types.ObjectId,
    ref:'Category',
    required: true
  },

  price: {
    type: Number,
    required: true
  },

  stock: {
    type: Number,
    required: true
  },

  status: {
    type: Boolean,
    default: true
  },
  isblocked:{
    type: Boolean,
    default: false,
  }
}, {
  timestamps: true
})

const Product = mongoose.model('Product', productSchema)
module.exports = Product