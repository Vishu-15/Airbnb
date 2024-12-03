const Listing=require('../models/listing.js');
const wrapAsync=require("../utils/wrapAsync.js");

module.exports.index=async(req,res)=>{
    let allListings = await Listing.find({});
    // console.log(allListings);
    res.render('listings/index.ejs',{allListings});
};

module.exports.renderNewForm=(req,res)=>{
    res.render('listings/new.ejs');
};

module.exports.createListing=wrapAsync(async(req,res)=>{
    let url = req.file.path;
    let filename = req.file.filename;

    let newListing = await new Listing(req.body.listing);
    newListing.owner=req.user._id;
    newListing.image = {url,filename};
    // console.log(newListing);
    await newListing.save();
    req.flash("success","New Listing added successfully!");//to add flash message which disappears after refresh
    res.redirect('/listings');
});

module.exports.showListing=wrapAsync(async(req,res)=>{
    let {id} = req.params;
    // console.log({id});
    // console.log(id);
    const listing = await Listing.findById(id)
        .populate({
            path:"reviews",
            populate:
                {path:"author"}
        })
        .populate("owner");
    if(!listing){
        req.flash("error","Listing you requested for does not exist !");
        res.redirect("/listings");
    }
    res.render('listings/show.ejs',{listing});
});

module.exports.renderEditForm=wrapAsync(async(req,res)=>{
    let {id}=req.params;
    const listing = await Listing.findById(id);
    if(!listing){
        req.flash("error","Listing you requested for does not exist !");
        res.redirect("/listings");
    }

    let originalImageURL = listing.image.url;
    originalImageURL = originalImageURL.replace("/upload","/upload/w_250");
    res.render('listings/edit.ejs',{listing,originalImageURL});
});

module.exports.updateListing=wrapAsync(async(req,res)=>{
    let {id}=req.params;
    let listing = await Listing.findByIdAndUpdate(id,{...req.body.listing},{runValidators:true,new:true});

    if(typeof req.file !=="undefined"){
        let url = req.file.path;
        let filename = req.file.filename;
        listing.image = {url,filename};
        await listing.save();
    }

    req.flash("success","Listing Updated !");
    res.redirect(`/listings/${id}`);
});

module.exports.destroyListing=wrapAsync(async(req,res)=>{
    let {id}=req.params;
    let delListing = await Listing.findByIdAndDelete(id);
    console.log(delListing);
    req.flash("success","Listing Deleted !");
    res.redirect('/listings');
});