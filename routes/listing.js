const express = require("express");
const router = express.Router();
const {ListingSchema,reviewSchema} = require("../schema.js");
const wrapAsync = require("../utils/wrapSync.js");
const ExpressEroor = require("../utils/ExpressError.js");
const Listing = require("../models/listing");
const {isloggedin, isOwner,validateListing} = require("../middleware.js");



//INDEX ROUTE
router.get("/",async (req,res)=>{
    let alllisting = await Listing.find();
    res.render("listings.ejs" , { alllisting });
});

//NEW ROUTE
router.get("/new",isloggedin,(req,res)=>{
    res.render("new.ejs");
})

//SHOW ROUTE
router.get("/:id" ,async(req,res)=>{
    let {id} = req.params;
    let rec = await Listing.findById(id).populate({path:"reviews",populate:{path:"author"},}).populate("owner");
    if(!rec){
        req.flash("error","The Listing does not exist!");
        res.redirect("/listings");
    }else{
        res.render("place.ejs" , {rec});
    }
    
})

//CREATE ROUTE
router.post("/",isloggedin, wrapAsync(async (req, res,next) => {
    console.log("in create post");
    let result= ListingSchema.validate(req.body);
    console.log(result);
    const newListing = new Listing(req.body);
    newListing.owner = req.user._id;
    await newListing.save();
    req.flash("success","new lisitng created!");
    res.redirect("/listings");

}));

router.get("/:id/edit",isloggedin,isOwner,async(req,res)=>{
    let {id} = req.params;
    let data = await  Listing.findById(id);
    if(!data){
        req.flash("error","The Listing does not exist!");
        res.redirect("/listings");
    }else{
        res.render("edit.ejs" , {data});
    }
    console.log(data);
    //res.render("edit.ejs",{data});
});

router.patch("/:id",isloggedin,isOwner,async(req,res)=>{
    let editListing = req.body;
    let {id} = req.params;
    let {title : newtitle,description:newdescription,image:newimage,price:newprice,location:newlocation,country:newcountry} = req.body;
    await Listing.findByIdAndUpdate(id , {
        title : newtitle,
        description : newdescription,
        image : newimage,
        price : newprice,
        location : newlocation,
        country : newcountry
    });
    req.flash("success","lisitng Updated!");
    res.redirect("/listings");
})

router.delete("/:id/delete",isloggedin,isOwner,async(req,res)=>{
    let {id} = req.params;
    await Listing.findByIdAndDelete(id);
    req.flash("success","lisitng Deleted!");
    res.redirect("/listings");
});

module.exports = router;