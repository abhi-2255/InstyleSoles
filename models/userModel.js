const mongoose  = require("mongoose");

const userSchema = new mongoose.Schema({
    firstName:{
        type: String,
        required : true
    },

    lastName:{
        type: String, 
        required : true
    },

    email : {
        type : String,
        required : true,
        
    },

    mobile : {
        type: Number 
    },

    password : {
        type : String,
        required : true
        
    },

    createdAt : {
        type : Date,
        default : Date.now()

    },

    isAdmin : {
        type : Boolean,
        default : false
    },

    isVerified : {
        type : Boolean,
        default:false,
    },

    isblocked : {
        type : Boolean,
        default : false
    }
},{
    timestamps : true
})

const User = new mongoose.model('User',userSchema)
module.exports = User