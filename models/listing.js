const mongoose = require("mongoose");
const Review=require("./review")

const listingSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String },

  image: {
    url:String,
    filename:String,
  },

  price: { type: Number, required: true },
  location: String,
  country: String,
  reviews: [{
  type: mongoose.Schema.Types.ObjectId,
  ref: "Review",
}],
  owner:{
    type:mongoose.Schema.Types.ObjectId,
    ref:"User",
},
// What is enum? (plain English)

// enum = allowed values list

// It means:

// “This field can ONLY contain these values. Nothing else.”
 geometry: {
  type: {
    type: String,
    enum: ["Point"],//For a single location on a map, we use:
    required: true
  },
  coordinates: {
    type: [Number], // [lng, lat]
    required: true
  }
}

  
 
});

listingSchema.post("findOneAndDelete",async(listing)=>{
  if(listing){
    await Review.deleteMany({_id:{$in:listing.reviews}})
  }
})

module.exports = mongoose.model("Listing", listingSchema);
 