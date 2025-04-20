const mongoose = require('mongoose');
const review = require('./review');
const { ref } = require('joi');
const { ListingSchema } = require('../schema');
const Schema = mongoose.Schema;  
const Review = require("./review.js")

const listSchema = new Schema({
    title : {
        type: String,
        require:true
    },
    description : String,
    image : {
        default : "https://static.scientificamerican.com/sciam/cache/file/4F73FD83-3377-42FC-915AD56BD66159FE_source.jpg",
        type : String,
        set : (v)=> v === "" ? "https://static.scientificamerican.com/sciam/cache/file/4F73FD83-3377-42FC-915AD56BD66159FE_source.jpg" : v,
    },
    price : {
        type : Number,
        require:true
        
    },
    location :{
        type :  String,
       
    },
    country : {
        type : String,
        
    },
    reviews : [
        {
            type : Schema.Types.ObjectId,
            ref: "Review"
        }
    ],
    owner :{
        type : Schema.Types.ObjectId,
        ref : "User"
    }
});

listSchema.post("findOneAndDelete",async(listing)=>{
    if(listing){
        await Review.deleteMany({_id : {$in : listing.reviews}})
    }
});

const Listing = mongoose.model("Listing" , listSchema);
module.exports = Listing;