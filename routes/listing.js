const express=require("express")
const router=express.Router({mergeParams:true});
const Listing=require("../models/listing.js")
const wrapAsync=require("../utils/wrapAsync.js");
const { isLoggedIn, isOwner,validateListing} = require("../loginmiddleware.js");
const listingController=require("../controller/listing")
const multer=require("multer")
const {storage}=require("../cloudConfig.js");
const upload=multer({storage})
router
  .route("/")
  .get(wrapAsync(listingController.index))
  .post(
    isLoggedIn,
    validateListing,
    upload.single("listing[image]"),
    wrapAsync(listingController.createListing)

  )
  


//new route
router.get("/new",isLoggedIn,(listingController.addNewListing))

router
  .route("/:id")
  .get(wrapAsync(listingController.showListing))
  .put(
  isLoggedIn,
  isOwner,
  upload.single("listing[image]"),
  validateListing,
  wrapAsync(listingController.updateListing)
)
  .delete(isOwner,wrapAsync(listingController.destoryListing))


// Edit form route
router.get("/:id/edit", isLoggedIn, isOwner, wrapAsync(listingController.editListing));

//update route

//http://localhost:8080/listings/695800d5780f70ba199fe8c8?_method=PUT
//delete route
module.exports=router;


// //create route
// app.post("/listings",async(req,res,next)=>{
//  // let {title,description,image,price,country,location}=req.body;
//  try{
//   const newlisting= new Listing(req.body.listing);//if i try to send price as string eventhough its a number,to handle that erro we write this code
//   await newlisting.save();
//   res.redirect("/listings")
//  }catch(err){
//     next(err);
//  }
// })
router