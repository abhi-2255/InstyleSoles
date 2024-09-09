const mongoose = require('mongoose')

const categorySchema = new mongoose.Schema({
    name: {
        type: String,
        require: true,
    },
    description: {
        type: String,
        require: true,
    },
    isblock: {
        type: Boolean,
        default: false,
    },
   
},{
    timestamps : true
}) 
 
const Category = mongoose.model('Category', categorySchema)
module.exports = Category