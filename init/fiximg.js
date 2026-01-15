const mongoose = require("mongoose");
const Listing = require("../models/listing");

async function fixImages() {
  try {
    await mongoose.connect("mongodb://127.0.0.1:27017/major_project"); // change DB name if needed
    console.log("Connected to DB");

    const result = await Listing.updateMany(
      { "image.url": { $not: /^https:\/\/images\.unsplash\.com/ } },
      {
        $set: {
          "image.filename": "listingimage",
          "image.url":
            "https://images.unsplash.com/photo-1501785888041-af3ef285b470?auto=format&fit=crop&w=800&q=60"
        }
      }
    );

    console.log("Updated:", result);
    process.exit();
  } catch (err) {
    console.error(err);
  }
}

fixImages();
