const Listing = require("../models/listing");
const Review = require("../models/review");


module.exports.createReview = async(req,res)=>{
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
}

module.exports.destroyReview = async(req,res)=>{
    let {id,reviewId} = req.params;
    await Review.findByIdAndDelete(reviewId);
    await Listing.findByIdAndUpdate(id,{$pull: {reviews:reviewId}})
    console.log("working");
    req.flash("success","Review Deleted!");
    res.redirect("/listings");
}