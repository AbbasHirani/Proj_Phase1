const Listing = require("../models/listing");

module.exports.index = async (req,res)=>{
    let alllisting = await Listing.find();
    res.render("listings.ejs" , { alllisting });
}

module.exports.newFormRender = (req,res)=>{
    res.render("new.ejs");
}

module.exports.showRoute = async(req,res)=>{
    let {id} = req.params;
    let rec = await Listing.findById(id).populate({path:"reviews",populate:{path:"author"},}).populate("owner");
    if(!rec){
        req.flash("error","The Listing does not exist!");
        res.redirect("/listings");
    }else{
        res.render("place.ejs" , {rec});
    }
    
}

module.exports.createListing = async (req, res,next) => {
    // console.log("in create post");
    // let result= ListingSchema.validate(req.body);
    // console.log(result);
    const newListing = new Listing(req.body);
    newListing.owner = req.user._id;
    await newListing.save();
    req.flash("success","new lisitng created!");
    res.redirect("/listings");

}

module.exports.editFormRender = async(req,res)=>{
    let {id} = req.params;
    let data = await  Listing.findById(id);
    if(!data){
        req.flash("error","The Listing does not exist!");
        res.redirect("/listings");
    }else{
        res.render("edit.ejs" , {data});
    }
    console.log(data);
    //res.render("edit.ejs",{data});
}

module.exports.editListing = async(req,res)=>{
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
    req.flash("success","lisitng Updated!");
    res.redirect("/listings");
}

module.exports.destoryListing = async(req,res)=>{
    let {id} = req.params;
    await Listing.findByIdAndDelete(id);
    req.flash("success","lisitng Deleted!");
    res.redirect("/listings");
}