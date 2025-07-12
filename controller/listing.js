const Listing = require("../models/listing");

const mbxGeoCoding = require('@mapbox/mapbox-sdk/services/geocoding');
const mapToken = process.env.MAP_TOKEN;
const geocodingClient = mbxGeoCoding({ accessToken: mapToken });

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

    //geocoding
    let  response = await geocodingClient.forwardGeocode({
        query: req.body.location,
        limit: 1
    })
    .send();

    // console.log("in create post");
    // let result= ListingSchema.validate(req.body);
    // console.log(result);
    let url = req.file.path;
    let filename = req.file.filename;
    const newListing = new Listing(req.body);
    newListing.owner = req.user._id;
    newListing.image = {url,filename};
    newListing.geometry = response.body.features[0].geometry
    await newListing.save();
    console.log("Listing saved");
    req.flash("success","new lisitng created!");
    res.redirect("/listings");

}

module.exports.editFormRender = async(req,res)=>{
    let {id} = req.params;
    let data = await  Listing.findById(id);
    if(!data){
        req.flash("error","The Listing does not exist!");
        res.redirect("/listings");
    }
    let originalImageUrl = data.image.url;
    originalImageUrl = originalImageUrl.replace("/upload","/upload/h_300,w_250");
    res.render("edit.ejs" , {data,originalImageUrl});

    console.log(data);
    //res.render("edit.ejs",{data});
}

module.exports.editListing = async(req,res)=>{
    let editListing = req.body;
    let {id} = req.params;
    let {title : newtitle,description:newdescription,image:newimage,price:newprice,location:newlocation,country:newcountry} = req.body;
    let listing = await Listing.findByIdAndUpdate(id , {
        title : newtitle,
        description : newdescription,
        image : newimage,
        price : newprice,
        location : newlocation,
        country : newcountry
    });
    if (typeof req.file !== "undefined") {
        let url = req.file.path;
        let filename = req.file.filename;
        listing.image = {url,filename};
        await listing.save();
    }
    
    req.flash("success","lisitng Updated!");
    res.redirect("/listings");
}

module.exports.destoryListing = async(req,res)=>{
    let {id} = req.params;
    await Listing.findByIdAndDelete(id);
    req.flash("success","lisitng Deleted!");
    res.redirect("/listings");
}