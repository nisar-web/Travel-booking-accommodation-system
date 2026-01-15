const Listing=require("./models/listing")
const Review=require("./models/review.js")
const {listingSchema}=require("./schema.js");
const {reviewSchema}=require("./schema.js")

const ExpressError= require("./utils/ExpressError.js");
module.exports.isLoggedIn=(req,res,next)=>{
     if(!req.isAuthenticated()){
        //redriect to page user was willling to see after login successfull
        req.session.redirectUrl=req.originalUrl;
    req.flash("error","You must be logged before creating listing!")
    return res.redirect("/login");
  }
  next();
}

module.exports.saveRedirectUrl=(req,res,next)=>{
    if(req.session.redirectUrl){// req.originalUrl refers to the abs link or the path that reuested eg /listing/new 
        res.locals.redirectUrl=req.session.redirectUrl// since the passport has the ability to acces thhe req.session it can reset all the values after the login , so we store that in req.locals so local variable doesnt have the authority to chnage the valuesor reset
    }
    next()
}

module.exports.isOwner = async (req, res, next) => {
  const { id } = req.params;
  const listing = await Listing.findById(id);

  if (!listing) {
    req.flash("error", "Listing not found");
    return res.redirect("/listings");
  }

  if (!listing.owner.equals(res.locals.currUser._id)) {
    req.flash("error", "You're not the owner of this listing");
    return res.redirect(`/listings/${id}`);
  }

  next();
};
module.exports.isReviewOwner = async (req, res, next) => {
  const { id, reviewId } = req.params;

  const review = await Review.findById(reviewId); // ✅ correct ID

  if (!review) {
    req.flash("error", "Review not found");
    return res.redirect(`/listings/${id}`);
  }

  if (!review.owner || !review.owner.equals(res.locals.currUser._id)) {
    req.flash("error", "You're not the owner of this review");
    return res.redirect(`/listings/${id}`);
  }

  next(); // ✅ allow delete/edit
};


module.exports.validateListing=(req,res,next)=>{
    let {error}=listingSchema.validate(req.body);
    if(error){
        let errMsg=error.details.map((el)=>el.message).join(",")
        throw new ExpressError(400,errMsg)
    }else{
        next();
    }
}

module.exports.validateReview = (req, res, next) => {
  // 🔒 Hard guard first
  if (!req.body || !req.body.review) {
    return next(new ExpressError(400, "Review data is required"));
  }

  // 🧪 Joi validation
  let { error } = reviewSchema.validate(req.body, { abortEarly: false });

  if (error) {
    let errMsg = error.details.map(el => el.message).join(", ");
    return next(new ExpressError(400, errMsg));
  }

  next();
};