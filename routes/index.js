const express=require("express")
const router=express.Router({mergeParams:true});
const Listing=require("../models/listing.js")
router.get("/",async (req,res)=>{
   let alllistings=await Listing.find({});    
      res.render("listings/index", { alllistings, searchQuery: null });
})

module.exports=router;