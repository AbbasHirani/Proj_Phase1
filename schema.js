const Joi = require("joi");


module.exports.ListingSchema = Joi.object({
    Listing:Joi.object({
        title: Joi.string().required(),
        descreption: Joi.string().required(),
        location:Joi.string().required(),
        country:Joi.string().required(),
        price:Joi.number().required().min(0),
        Image:Joi.string().allow("",null),
    }).required(),
});


//review Schemaa

module.exports.reviewSchema = Joi.object({
    review:Joi.object({
        ratings : Joi.number().required(),
        comment : Joi.string().required(),
    }).required(),
})