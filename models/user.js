const mongoose = require('mongoose');
const Schema = mongoose.Schema;  
const passportLocalMongoose = require("passport-local-mongoose");

const userSchemma = new Schema({
    email :{
        type : String,
        required : true,
    },
});

userSchemma.plugin(passportLocalMongoose);
module.exports = mongoose.model("User",userSchemma);
