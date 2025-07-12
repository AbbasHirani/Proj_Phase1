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
        url : String,
        filename : String      
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
    },
    geometry: {
    type: {
      type: String, // Don't do `{ location: { type: String } }`
      enum: ['Point'], // 'location.type' must be 'Point'
      required: true
    },
    coordinates: {
      type: [Number],
      required: true
    }
  }
});

listSchema.post("findOneAndDelete",async(listing)=>{
    if(listing){
        await Review.deleteMany({_id : {$in : listing.reviews}})
    }
});

const Listing = mongoose.model("Listing" , listSchema);
module.exports = Listing;