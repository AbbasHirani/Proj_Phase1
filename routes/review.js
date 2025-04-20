const express = require("express");
const router = express.Router({mergeParams:true});
const {ListingSchema,reviewSchema} = require("../schema.js");
const wrapAsync = require("../utils/wrapSync.js");
const ExpressEroor = require("../utils/ExpressError.js");
const Review = require("../models/review.js");
const Listing = require("../models/listing");
const {validateReview, isloggedin,isReviewAuthor} = require("../middleware.js");


//reviews
router.post("/",isloggedin,validateReview,wrapAsync(async(req,res)=>{
    let {id} = req.params;
    let listing =  await Listing.findById(id);
    console.log(req.body.review)
    let newRev = new Review(req.body.review);
    newRev.author = req.user._id;
    

    listing.reviews.push(newRev);
    
    await newRev.save();
    await listing.save();
    req.flash("success","new Review created!");
    res.redirect("/listings");  
}));

//delete review route
router.delete("/:reviewId",isloggedin,isReviewAuthor,wrapAsync(async(req,res)=>{
    let {id,reviewId} = req.params;
    await Review.findByIdAndDelete(reviewId);
    await Listing.findByIdAndUpdate(id,{$pull: {reviews:reviewId}})
    console.log("working");
    req.flash("success","Review Deleted!");
    res.redirect("/listings");
}));

module.exports = router;