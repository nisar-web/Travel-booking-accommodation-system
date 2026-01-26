const Review = require("../models/review");
const Listing = require("../models/listing");
const ExpressError = require("../utils/ExpressError");

// CREATE REVIEW
// module.exports.createReview = async (req, res) => {
//   const listing = await Listing.findById(req.params.id);
//   if (!listing) {
//     throw new ExpressError(404, "Listing not found");
//   }

//   const newReview = new Review(req.body.review);
//   newReview.owner = req.user._id;

//   listing.reviews.push(newReview);

//   await newReview.save();
//   await listing.save();

//   req.flash("success", "Rating added successfully");
//   res.redirect(`/listings/${listing._id}`);
// };

module.exports.createReview = async (req, res) => {
  const listing = await Listing.findById(req.params.id);
  if (!listing) {
    throw new ExpressError(404, "Listing not found");
  }

  const newReview = new Review(req.body.review);
  newReview.owner = req.user._id;

  await newReview.save();
  console.log(req.body.review)
  await Listing.findByIdAndUpdate(listing._id, {
    $push: { reviews: newReview._id }
  });
  
  req.flash("success", "Rating added successfully");
  res.redirect(`/listings/${listing._id}`);
};

// DELETE REVIEW
module.exports.deleteReview = async (req, res) => {
  const { id, reviewId } = req.params;

  const listing = await Listing.findByIdAndUpdate(
    id,
    { $pull: { reviews: reviewId } },
    { new: true }
  );

  if (!listing) {
    throw new ExpressError(404, "Listing not found");
  }

  await Review.findByIdAndDelete(reviewId);

  req.flash("success", "Review deleted successfully");
  res.redirect(`/listings/${id}`);
};
