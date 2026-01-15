const Listing = require("../models/listing");

async function geocodeLocation(location) {
  const url = `https://api.geoapify.com/v1/geocode/search?text=${encodeURIComponent(
    location
  )}&limit=1&apiKey=${process.env.MAP_TOKEN}`;

  const response = await fetch(url);
  const data = await response.json();

  if (!data.features || data.features.length === 0) {
    return null;
  }

  const [lng, lat] = data.features[0].geometry.coordinates;
  return { lng, lat };
}


module.exports.index=async(req,res)=>{
    let alllistings=await Listing.find({});
    res.render("listings/index.ejs",{alllistings})
}
module.exports.addNewListing=(req,res)=>{
    res.render("listings/new.ejs")
}
module.exports.showListing=async (req, res) => {
    let { id } = req.params;
    let listing = await Listing.findById(id).populate({
      path:"reviews",
      populate:{path:"owner"}}).populate("owner");

    // 🚨 THIS IS CRITICAL
    if (!listing) {
        req.flash("error", "Listing not found");
        return res.redirect("/listings");
    }
     // 🔒 SAFETY CHECK
  if (!listing.geometry || !listing.geometry.coordinates) {
    req.flash("error", "Location data missing for this listing");
    return res.redirect("/listings");
  }

    res.render("listings/show.ejs", { listing });
}

module.exports.createListing=async(req,res,next)=>{
//  // let {title,description,image,price,country,location}=req.body;
//  if(!req.body.listing){
//     throw new ExpressError(400,"send a valid data for listing")//400 means bad request by client so server cant handle this
//  }
     const coords = await geocodeLocation(req.body.listing.location);
    
  if (!coords) {
    req.flash("error", "Invalid location");
    return res.redirect("/listings/new");
  }


 let url=req.file.path;
 let filename=req.file.filename


  const newlisting= new Listing(req.body.listing)
newlisting.owner=req.user._id
newlisting.image.url=url;
newlisting.image.filename = filename;

  //if i try to send price as string eventhough its a number,to handle that erro we write this code
//    if(!newlisting.title){
//     throw new ExpressError(400,"Required a title")
//    }
//    if(!newlisting.description){
//     throw new ExpressError(400,"Required a description")
//    }
//    if(!newlisting.price){
//     throw new ExpressError(400,"Required a price")
//    }
//    if(!newlisting.location){
//     throw new ExpressError(400,"Required a location")
//    }
//    if(!newlisting.country){
//     throw new ExpressError(400,"Required a country")
//    }

    // ✅ GeoJSON format (IMPORTANT)
  newlisting.geometry = {
    type: "Point",
    coordinates: [coords.lng, coords.lat]
  };

  await newlisting.save();
  req.flash("success","New Listing Added");
  res.redirect("/listings")
 
   
 
}

module.exports.editListing=async (req, res) => {
  const { id } = req.params;

  const listing = await Listing.findById(id);

  if (!listing) {
    req.flash("error", "Listing not found");
    return res.redirect("/listings");
  }
    console.log(listing)
  let  orgimg=listing.image.url;
  orgimg=orgimg.replace("/upload","/upload/w_250");//accessing the image url from the url which was return by cloudinary after saving our hight quality img ,now we just modified url using cloudnary api and tranfoermed into low qauloty img//Cloudinary stores the original image in high quality.
//By modifying the image URL, we request a smaller version of the same image to improve performance and page loading speed.

  res.render("listings/edit.ejs", { listing,orgimg});
}

module.exports.updateListing=async (req, res) => {

    const { id } = req.params;

    if (!req.body.listing) {
      throw new ExpressError(400, "Send valid listing data");
    }

    let listing =await Listing.findByIdAndUpdate(
      id,
      { $set: req.body.listing }, // ✅ IMPORTANT
      { runValidators: true }
    );
     if(typeof req.file!== "undefined"){
      let url=req.file.path;
      let filename=req.file.filename
   
     listing.image={url,filename};
     await listing.save();
     }
    req.flash("success", "Listing updated");
    res.redirect(`/listings/${id}`);
  }

  module.exports.destoryListing=async(req,res)=>{
      let {id}=req.params;
      let deleteList=await Listing.findByIdAndDelete(id)
        req.flash("success","Listing Deleted")
       res.redirect("/listings");
  }