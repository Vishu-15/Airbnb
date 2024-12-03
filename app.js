if(process.env.NODE_ENV!="production"){
    require('dotenv').config();
}
console.log(process.env.CLOUD_NAME);

const express=require('express');
const app=express();
const mongoose=require('mongoose');
const path=require('path');
const methodOverride=require('method-override');
const ejsMate=require('ejs-mate');
const Listing=require('./models/listing.js');
const ExpressError=require("./utils/ExpressError.js");
const session=require('express-session');
const MongoStore = require('connect-mongo');
const flash=require('connect-flash');
const passport=require('passport');
const LocalStrategy=require('passport-local');
const User=require('./models/user.js');

const listingRoute=require("./routes/listing.js");
const reviewsRoute=require("./routes/reviews.js");
const userRoute=require("./routes/user.js");

app.set('view engine','ejs');
app.set('views',path.join(__dirname,'/views'));
app.use(express.static(path.join(__dirname,'/public')));
app.use(express.urlencoded({extended:true}));
app.use(methodOverride("_method"));
app.engine('ejs',ejsMate);

const dbUrl = process.env.ATLAS_DB_URL;

main()
    .then(()=>{
        console.log('connection succesful');
    })
    .catch(err => console.log(err));

async function main() {
  await mongoose.connect(dbUrl);
};

const store = MongoStore.create({
    mongoUrl:dbUrl,
    crypto:{
        secret:process.env.SECRET,
    },
    touchAfter:24*3600,//session interval
});

store.on("error",()=>{
    console.log("ERROR in MONGO SESSION STORE ",err);
})

const sessionOptions={
    store,
    secret:process.env.SECRET,
    resave:false,
    saveUninitialized:true,
    cookie:{
        expires: Date.now() + 7*24*60*60*1000,
        maxAge: 7*24*60*60*1000,
        httpOnly: true, //to prevent cross script attacks
    },
};

app.use(session(sessionOptions));
app.use(flash());

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use((req,res,next)=>{
    res.locals.success=req.flash("success");
    res.locals.error=req.flash("error");
    res.locals.currUser=req.user;
    next();
});

// app.get('/',(req,res)=>{
//     res.send('hey , i am root ');
// });

app.get('/demouser',async (req,res)=>{
    let fakeUser=new User({
        email:"student@gmail.com",
        username:"bppimt-student",
    });
    
    let registerUser = await User.register(fakeUser,"helloworld");
    res.send(registerUser);
});

app.use("/listings",listingRoute);
app.use("/listings/:id/reviews",reviewsRoute);
app.use("/",userRoute);

app.all("*",(req,res,next)=>{
    next(new ExpressError(404,"Page Not Found!"));
});

app.use((err,req,res,next)=>{
    let{statusCode=500,message="Something Went Wrong!"}=err;
    res.status(statusCode).render('error.ejs',{message});
});

app.listen('8080',()=>{
    console.log('app is listening at port 8080');
});