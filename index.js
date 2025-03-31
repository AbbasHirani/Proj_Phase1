const express = require("express");
const app = express();
const ejs = require("ejs");
const mongoose = require("mongoose");
const Listing = require("./models/listing");
const path = require("path");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
app.use(express.static(path.join(__dirname,"public")))
app.use(express.urlencoded({extended:true}));
app.use(express.json());
app.use(methodOverride("_method"));
app.set("views", path.join(__dirname,"views"));
app.set("view engine","ejs");
app.engine("ejs",ejsMate);
app.use(express.static("public"));
const wrapAsync = require("./utils/wrapSync.js");
const ExpressEroor = require("./utils/ExpressError.js");
const {ListingSchema,reviewSchema} = require("./schema.js");
const Review = require("./models/review.js");
const MONGO_URL = "mongodb://127.0.0.1:27017/wanderlust";

const validateReview  = (req,res,next)=>{
    let {error}= reviewSchema.validate(req.body);
        if(error){
            let errMsg = error.details.map((el)=> el.message).join(",");
            throw new ExpressEroor(400,errMsg)
        }else{
            next();
        }
        
}

const validateListing  = (req,res,next)=>{
    let {error}= ListingSchema.validate(req.body);
        if(error){
            let errMsg = error.details.map((el)=> el.message).join(",");
            throw new ExpressEroor(400,errMsg)
        }else{
            next();
        }
        
}

main().then(()=>{
    console.log("connected to db");
}).catch((err)=>{
    console.log(err);
})

async function main() {
    await mongoose.connect(MONGO_URL);
}

app.get("/",(req,res)=>{
    res.send("WORKING");
})

app.get("/test",async (req,res)=>{
    let list = new Listing({
        title : "Test",
        description : "test",
        image : "",
        price : 848,
        location : "test",
        country : "test"
    });

    await list.save();
    res.send("updated");
});

//INDEX ROUTE
app.get("/listings",async (req,res)=>{
    let alllisting = await Listing.find();
    res.render("listings.ejs" , { alllisting });
});

//NEW ROUTE
app.get("/listings/new",(req,res)=>{
    res.render("new.ejs");
})

//SHOW ROUTE
app.get("/listings/:id" ,async(req,res)=>{
    let {id} = req.params;
    let rec = await Listing.findById(id).populate("reviews");
    res.render("place.ejs" , {rec});
})

//CREATE ROUTE
app.post("/listings", wrapAsync(async (req, res,next) => {
        let result= ListingSchema.validate(req.body);
        console.log(result);
        const newListing = new Listing(req.body);
        await newListing.save();
        res.redirect("/listings");

  })
);

                        // OR

        // let {title,description,image,price,location,country} = req.body;
    // let newdata = new Listing({
    //     title : title,
    //     description : description,
    //     image : image,
    //     price : price,
    //     location : location,
    //     country : country
    // })
    // await newdata.save().then(()=>{ 
    //     res.redirect("/listings");
    // }).catch((err)=>{
    //     res.render("err.ejs", {err});
    // });

app.get("/listings/:id/edit",async(req,res)=>{
    let {id} = req.params;
    let data = await  Listing.findById(id);
    console.log(data);
    res.render("edit.ejs",{data});
});

app.patch("/listings/:id",async(req,res)=>{
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

app.delete("/listings/:id/delete",async(req,res)=>{
    let {id} = req.params;
    await Listing.findByIdAndDelete(id);
    res.redirect("/listings");
});

//reviews
app.post("/listings/:id/reviews",validateReview,wrapAsync(async(req,res)=>{
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
app.delete("/listings/:id/reviews/:reviewId",wrapAsync(async(req,res)=>{
    let {id,reviewId} = req.params;
    await Review.findByIdAndDelete(reviewId);
    await Listing.findByIdAndUpdate(id,{$pull: {reviews:reviewId}})
    console.log("working");
    res.redirect("/listings");
}))

app.use((err,req,res,next)=>{
    let{ statusCode = 500,message = "something went wrong"} = err;
    console.log(message);
    //res.send("something went wrong");
    res.render("error.ejs" , {message});  
})

app.listen(8080,()=>{
    console.log("app is listening to port 8080");
});