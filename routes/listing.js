const express = require("express");
const router = express.Router();
const {ListingSchema,reviewSchema} = require("../schema.js");
const wrapAsync = require("../utils/wrapSync.js");
const ExpressEroor = require("../utils/ExpressError.js");
const Listing = require("../models/listing");

const validateListing  = (req,res,next)=>{
    let {error}= ListingSchema.validate(req.body);
        if(error){
            let errMsg = error.details.map((el)=> el.message).join(",");
            throw new ExpressEroor(400,errMsg)
        }else{
            next();
        }
        
}

//INDEX ROUTE
router.get("/",async (req,res)=>{
    let alllisting = await Listing.find();
    res.render("listings.ejs" , { alllisting });
});

//NEW ROUTE
router.get("/new",(req,res)=>{
    res.render("new.ejs");
})

//SHOW ROUTE
router.get("/:id" ,async(req,res)=>{
    let {id} = req.params;
    let rec = await Listing.findById(id).populate("reviews");
    res.render("place.ejs" , {rec});
})

//CREATE ROUTE
router.post("/", wrapAsync(async (req, res,next) => {
    let result= ListingSchema.validate(req.body);
    console.log(result);
    const newListing = new Listing(req.body);
    await newListing.save();
    res.redirect("/listings");

}));

router.get("/:id/edit",async(req,res)=>{
    let {id} = req.params;
    let data = await  Listing.findById(id);
    console.log(data);
    res.render("edit.ejs",{data});
});

router.patch("/:id",async(req,res)=>{
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
    res.redirect("/listings");
})

router.delete("/:id/delete",async(req,res)=>{
    let {id} = req.params;
    await Listing.findByIdAndDelete(id);
    res.redirect("/listings");
});

module.exports = router;