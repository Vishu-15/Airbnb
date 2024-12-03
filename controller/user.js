const User=require('../models/user.js');
const wrapAsync = require("../utils/wrapAsync.js");

module.exports.renderSignupForm=(req,res)=>{
    res.render("user/signup.ejs");
};

module.exports.signUp=wrapAsync(async(req,res)=>{
    try{
        let {username,email,password}=req.body;
        let newUser=new User({username,email});
        let registeredUser=await User.register(newUser,password);
        console.log(registeredUser);
        req.login(registeredUser,(err)=>{
            if(err){
                return next(err);
            }
            req.flash("success","Welcome to WanderLust !");
            res.redirect('/listings');
        });
    }
    catch(e){
        req.flash("error",e.message);
        res.redirect('/signup');
    }
});

module.exports.renderLoginForm=(req,res)=>{
    res.render("user/login.ejs");
};

module.exports.login=async(req,res)=>{
    req.flash("success","Welcome back to WanderLust !");
    let redirectUrl=res.locals.redirectUrl || "/listings";
    res.redirect(redirectUrl);
};

module.exports.logout=(req,res,next)=>{
    req.logout((err)=>{
        if(err){
            return next(err);
        }
        req.flash("success","Logged You Out !");
        res.redirect("/listings");
    }
)};