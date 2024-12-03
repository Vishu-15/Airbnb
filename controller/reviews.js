const Listing=require("../models/listing");
const Review=require('../models/reviews.js');
const wrapAsync=require("../utils/wrapAsync.js");

module.exports.postReview=wrapAsync(async(req,res)=>{
    let {id}=req.params;
    let listing=await Listing.findById(id);
    console.log(listing);
    let newReview=new Review(req.body.review);
    newReview.author=req.user._id;
    console.log(newReview);

    listing.reviews.push(newReview);

    await newReview.save();
    await listing.save();
    req.flash("success","New Review added successfully !");
    res.redirect(`/listings/${listing._id}`);
}
)

module.exports.destroyReview=wrapAsync(async(req,res)=>{
    let {id,reviewId}=req.params;

    await Listing.findByIdAndUpdate(id,{$pull :{ reviews : reviewId}});
    await Review.findByIdAndDelete(reviewId);

    req.flash("success","Review Deleted !");
    res.redirect(`/listings/${id}`);
});
