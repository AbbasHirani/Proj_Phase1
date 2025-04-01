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

const listings = require("./routes/listing.js");
const reviews = require("./routes/review.js");


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

app.use("/listings" , listings);

app.use("/listings/:id/reviews" , reviews);

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

app.use((err,req,res,next)=>{
    let{ statusCode = 500,message = "something went wrong"} = err;
    console.log(message);
    //res.send("something went wrong");
    res.render("error.ejs" , {message});  
})

app.listen(8080,()=>{
    console.log("app is listening to port 8080");
});