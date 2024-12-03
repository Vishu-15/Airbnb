const express=require("express");
const router=express.Router();
const Listing=require('../models/listing.js');
const wrapAsync=require("../utils/wrapAsync.js");
const ExpressError=require("../utils/ExpressError.js");
const { isLoggedIn,isOwner,validateListing } = require("../middleware.js");

const {storage} = require("../cloudConfig.js");
const multer  = require('multer');
const upload = multer({storage});

const listingController=require("../controller/listing.js");


//Index Route
router
    .route("/")
    .get(listingController.index)   
    .post(
        isLoggedIn,
        upload.single('listing[image]'),
        validateListing,
        listingController.createListing,
    )

//New Route
router.get('/new',
    isLoggedIn,  
    listingController.renderNewForm
);

//Show Route //Update //Delete Route
router
    .route("/:id")
    .get(listingController.showListing)
    .put(
        isLoggedIn,
        isOwner,
        upload.single('listing[image]'),
        validateListing,
        listingController.updateListing
    )
    .delete(
        isLoggedIn,
        isOwner,
        listingController.destroyListing
    );


//Update Route 
router.get('/:id/edit',
    isLoggedIn, 
    listingController.renderEditForm
);

module.exports=router;