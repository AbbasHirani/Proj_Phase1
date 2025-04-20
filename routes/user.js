const express = require("express");
const router = express.Router();
const User = require("../models/user");
const wrapAsync = require("../utils/wrapSync");
const passport = require("passport");
const review = require("../models/review");
const { saveRedirectUrl } = require("../middleware");

router.get("/signup", (req,res)=>{
    res.render("users/signupform.ejs");
})

router.post("/signup",wrapAsync(async(req,res)=>{
    try{
        let {username , email , password} = req.body;
    const newUser = new User({email,username});
    const registeredUser = await User.register(newUser,password);
    console.log(registeredUser);

    req.login(registeredUser,(err)=>{
        if(err){
            return next();
        }
        req.flash("success",`Welcome to Wanderlust ${username}`);
        res.redirect("/listings");
    })
    }catch(e){
        req.flash("error",e.message);
        res.redirect("/signup");
    }
}));

router.get("/login", (req,res)=>{
    res.render("users/login.ejs");
})

router.post("/login",saveRedirectUrl,passport.authenticate("local",{failureRedirect:"/login",failureFlash:true}),async(req,res)=>{
    req.flash("success","Welcome Back to Wanderlust");
    // res.redirect(res.locals.redirectUrl);
    let redirectUrl = res.locals.redirectUrl || "/listings"
    res.redirect(redirectUrl); 
})

router.get("/logout",(req,res,next)=>{
    req.logOut((err)=>{
        if(err){
            return next(err);
        }
        req.flash("success","You are successfully Logged out!");
        res.redirect("/listings");
    });
})

module.exports = router;