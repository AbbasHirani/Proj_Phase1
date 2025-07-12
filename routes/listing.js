const express = require("express");
const router = express.Router();
const {ListingSchema,reviewSchema} = require("../schema.js");
const wrapAsync = require("../utils/wrapSync.js");
const ExpressEroor = require("../utils/ExpressError.js");
const Listing = require("../models/listing");
const {isloggedin, isOwner,validateListing} = require("../middleware.js");

const ListingController = require("../controller/listing.js");

//requireing cloudinary
const{cloudinary,storage} = require("../cloudConfig.js");

//MULTER - to parse the files
const multer  = require('multer')
const upload = multer({storage})

//INDEX ROUTE
router.get("/",ListingController.index);

//NEW ROUTE
router.get("/new",isloggedin,ListingController.newFormRender);

//SHOW ROUTE
router.get("/:id" ,ListingController.showRoute);

//CREATE ROUTE
router.post("/",isloggedin,upload.single("image"),wrapAsync(ListingController.createListing));

router.get("/:id/edit",isloggedin,isOwner,ListingController.editFormRender);

router.patch("/:id",isloggedin,isOwner,upload.single("image"),ListingController.editListing);

router.delete("/:id/delete",isloggedin,isOwner,ListingController.destoryListing);

module.exports = router;