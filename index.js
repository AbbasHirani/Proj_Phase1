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
const passport = require("passport");
const LocalStrategy = require("passport-local");
const User = require("./models/user.js");

const flash = require("connect-flash");

const listingRouter = require("./routes/listing.js");
const reviewRouter = require("./routes/review.js");
const userRouter = require("./routes/user.js");

const session = require("express-session");

const cookieParser = require("cookie-parser");

app.use(cookieParser());

const sessionOptions = {
    secret:"secretString",
    resave : false,
    saveUninitialized : true,
    expires : Date.now() + 7 *24*60*60*1000,
    maxAge : 7 *24*60*60*1000,
    httpOnly : true
};

app.use(session(sessionOptions));
app.use(flash());

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use((req,res,next)=>{
    res.locals.success = req.flash("success");
    res.locals.error = req.flash("error");
    next();
})

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
    console.log(req.cookies);
})

app.get("/demouser" , async (req,res)=>{
    let fakeuser = new User({
        email : "student@gmail.com",
        username : "student",
    });
    let registeredUser = await User.register(fakeuser,"test");
    res.send(registeredUser);
});

app.use("/listings" , listingRouter);
app.use("/listings/:id/reviews" , reviewRouter);
app.use("/" , userRouter);

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