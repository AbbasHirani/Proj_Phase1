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