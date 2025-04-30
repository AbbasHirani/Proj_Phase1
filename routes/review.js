const express = require("express");
const router = express.Router({mergeParams:true});
const {ListingSchema,reviewSchema} = require("../schema.js");
const wrapAsync = require("../utils/wrapSync.js");
const ExpressEroor = require("../utils/ExpressError.js");
const Review = require("../models/review.js");
const Listing = require("../models/listing");
const {validateReview, isloggedin,isReviewAuthor} = require("../middleware.js");

const reviewController = require("../controller/review.js")

//reviews
router.post("/",isloggedin,validateReview,wrapAsync(reviewController.createReview));

//delete review route
router.delete("/:reviewId",isloggedin,isReviewAuthor,wrapAsync(reviewController.destroyReview));

module.exports = router;