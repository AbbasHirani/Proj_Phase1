const Listing = require("./models/listing");
const Review = require("./models/review.js");
const ExpressEroor = require("./utils/ExpressError.js");
const {ListingSchema,reviewSchema} = require("./schema.js");


module.exports.isloggedin = (req,res,next)=>{
    if(!req.isAuthenticated()){
        console.log(req.originalUrl);
        req.session.redirectUrl =req.originalUrl;
        req.flash("error","you must be signed in!");
        return res.redirect("/login");
    }
    next();
}

module.exports.saveRedirectUrl = (req,res,next)=>{
    if(req.session.redirectUrl){
        res.locals.redirectUrl = req.session.redirectUrl; 
    }
    next();
}

module.exports.isOwner = async(req,res,next)=>{
    let {id} = req.params;
    let listing = await Listing.findById(id);
    if(!listing.owner._id.equals(res.locals.currUser._id)){
        req.flash("error","You are not the Owner of this listing");
        return res.redirect(`/listings/${id}`);
    }
    console.log(listing);

    next();
}

module.exports.validateListing  = (req,res,next)=>{
    let {error}= ListingSchema.validate(req.body);
        if(error){
            let errMsg = error.details.map((el)=> el.message).join(",");
            throw new ExpressEroor(400,errMsg)
        }else{
            next();
        }
        
}

module.exports.validateReview  = (req,res,next)=>{
    let {error}= reviewSchema.validate(req.body);
        if(error){
            let errMsg = error.details.map((el)=> el.message).join(",");
            throw new ExpressEroor(400,errMsg)
        }else{
            next();
        }     
}


module.exports.isReviewAuthor = async(req,res,next)=>{
    let {id,reviewId} = req.params;
    let review = await Review.findById(reviewId);
    if(!review.author.equals(res.locals.currUser._id)){
        req.flash("error","You did not Create this Review. Cant delete it!");
        return res.redirect(`/listings/${id}`);
    }
    next();
}