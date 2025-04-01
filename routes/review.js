const express = require("express");
const router = express.Router({mergeParams:true});
const {ListingSchema,reviewSchema} = require("../schema.js");
const wrapAsync = require("../utils/wrapSync.js");
const ExpressEroor = require("../utils/ExpressError.js");
const Review = require("../models/review.js");
const Listing = require("../models/listing");


const validateReview  = (req,res,next)=>{
    let {error}= reviewSchema.validate(req.body);
        if(error){
            let errMsg = error.details.map((el)=> el.message).join(",");
            throw new ExpressEroor(400,errMsg)
        }else{
            next();
        }
        
}

//reviews
router.post("/",validateReview,wrapAsync(async(req,res)=>{
    let {id} = req.params;
    let listing =  await Listing.findById(id);
    console.log(req.body.review)
    let newRev = new Review(req.body.review);
    

    listing.reviews.push(newRev);
    
    await newRev.save();
    await listing.save();
    res.redirect("/listings");  
}));

//delete review route
router.delete("/:reviewId",wrapAsync(async(req,res)=>{
    let {id,reviewId} = req.params;
    await Review.findByIdAndDelete(reviewId);
    await Listing.findByIdAndUpdate(id,{$pull: {reviews:reviewId}})
    console.log("working");
    res.redirect("/listings");
}));

module.exports = router;