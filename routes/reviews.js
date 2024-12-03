const express=require('express');
const router=express.Router({mergeParams:true});
const wrapAsync=require("../utils/wrapAsync.js");
const ExpressError=require("../utils/ExpressError.js");
const Listing=require('../models/listing.js');
const Review=require('../models/reviews.js');
const {validateReview,isLoggedIn, isReviewAuthor}=require("../middleware.js");

const reviewController=require("../controller/reviews.js");


//Review Post Route
router.post('/',
    isLoggedIn,
    validateReview,
    reviewController.postReview);

// Review Delete Route
router.delete('/:reviewId',
    isLoggedIn,
    isReviewAuthor,
    reviewController.destroyReview
);

module.exports=router;