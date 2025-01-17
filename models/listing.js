const mongoose = require('mongoose');
const Schema = mongoose.Schema;  


const listSchema = new Schema({
    title : {
        type: String,
        required : true
    },
    description : String,
    image : {
        default : "https://static.scientificamerican.com/sciam/cache/file/4F73FD83-3377-42FC-915AD56BD66159FE_source.jpg",
        type : String,
        set : (v)=> v === "" ? "https://static.scientificamerican.com/sciam/cache/file/4F73FD83-3377-42FC-915AD56BD66159FE_source.jpg" : v,
    },
    price : {
        type : Number,
        required : true
    },
    location :{
        type :  String,
        required : true 
    },
    country : {
        type : String,
        required : true
    }
});

const Listing = mongoose.model("Listing" , listSchema);
module.exports = Listing;