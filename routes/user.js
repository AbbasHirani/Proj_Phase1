const express = require("express");
const router = express.Router();
const User = require("../models/user");
const wrapAsync = require("../utils/wrapSync");
const passport = require("passport");
const review = require("../models/review");
const { saveRedirectUrl } = require("../middleware");

const userController = require("../controller/user.js")

router.get("/signup",userController.signUpFormRender);

router.post("/signup",wrapAsync(userController.signUp));    

router.get("/login",userController.loginFormRender)

router.post("/login",saveRedirectUrl,passport.authenticate("local",{failureRedirect:"/login",failureFlash:true}),userController.userLogin)

router.get("/logout",userController.userLogout);

module.exports = router;