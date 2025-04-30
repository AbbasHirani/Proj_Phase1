const User = require("../models/user")

module.exports.signUpFormRender =  (req,res)=>{
    res.render("users/signupform.ejs");
}

module.exports.signUp = async(req,res)=>{
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
}

module.exports.loginFormRender =  (req,res)=>{
    res.render("users/login.ejs");
}

module.exports.userLogin = async(req,res)=>{
    req.flash("success","Welcome Back to Wanderlust");
    // res.redirect(res.locals.redirectUrl);
    let redirectUrl = res.locals.redirectUrl || "/listings"
    res.redirect(redirectUrl); 
}

module.exports.userLogout = (req,res,next)=>{
    req.logOut((err)=>{
        if(err){
            return next(err);
        }
        req.flash("success","You are successfully Logged out!");
        res.redirect("/listings");
    });
}