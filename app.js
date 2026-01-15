if(process.env.NODE_ENV != "production"){
  require("dotenv").config()
}
const express=require("express")
const app = express();
const mongoose=require("mongoose");
const path=require("path") 
const mongourl="mongodb://127.0.0.1:27017/wanderlust";
const methodOverride=require("method-override")
const ejsMate=require("ejs-mate")
const ExpressError= require("./utils/ExpressError.js");

const atlasDB=process.env.ATLASDB_URL


const session =require("express-session")
const { default: MongoStore } = require("connect-mongo")//momgodb based session store 
const flash=require("connect-flash");
//passport is express compataible authenthecation middleware for nodejs
//passport-local is strategy used for authecate user by getting thier username and info
//passport-local-mongoose automatically adds the username paswoord which salted and hashed ,also it adds the instance and static methods to the docs(obj of that model)
const listingRoute=require("./routes/listing.js")
const reviewRoute=require("./routes/review.js")
const userRoute=require("./routes/user.js")

const passport=require("passport");
const LocalStrategy=require("passport-local")
const User=require("./models/user.js")

// Use ejs-mate for all .ejs files
app.engine('ejs', ejsMate);
app.set("view engine","ejs")
app.set("views",path.join(__dirname,"views"))
app.use(express.urlencoded({extended :true}))
app.use(express.json());

app.use(methodOverride("_method"))
app.use(express.static(path.join(__dirname,"/public")))

// this store session related information ,in atlas db so that my user who visit website eill be nvere relogin for 14 days
 const store =  MongoStore.create({
  mongoUrl: atlasDB,
  secret: process.env.SECRET,
  touchAfter: 24 * 3600,
});
let sessionOptions = {
  store,// so we basiclly store this info in our session mmidlare
  secret:  process.env.SECRET,
  resave: false,
  saveUninitialized: true,
  cookie:{
    expires:Date.now() +7 * 24 * 60 * 60 * 1000,// 7=days,24=hrs,60=min,60=sec,1000=millisecs
    maxAge:7 * 24 * 60 * 60 * 1000,
  },
  httpOnly:true,
};


app.use(session(sessionOptions))

app.use(flash())
app.use(passport.initialize())
app.use(passport.session())
// passport-local is a strategy used to authenticate users using username and password
// passport-local-mongoose automatically adds username and password fields,
// hashes and salts the password,
// and adds helpful instance and static methods to the User model

//passport.use(new localStrategy(User.autheticate()))-use for whatever the user is login basiclly hleps to autheticate
passport.use(new LocalStrategy(User.authenticate()))
//storing the user information into session 
passport.serializeUser(User.serializeUser());
//removeing info from session
passport.deserializeUser(User.deserializeUser())
//UNDERSTAND THIS  ABOVE 3 INES OF CODE IN THE FILE NAME ELEVEN 011

main().then(()=>{
    console.log("connection to db")
})

async function main() {
   await mongoose.connect(atlasDB);    
}
// app.get("/testListing", async(req,res)=>{
//     let sampleListing= new Listing({
//         title:"my new villa",
//         description:"By the beach",
//         price:1200,
//         location:"calangute,goa",
//         country:"india",
//     })
//   await sampleListing.save();
// console.log("saved listing");
// res.send("saved");

// })
app.use((req,res,next)=>{
    res.locals.success=req.flash("success")
    res.locals.error=req.flash("error")
    res.locals.currUser=req.user;
    next();
})

// app.get("/demouser",async(req,res)=>{
//   let fakeUser = new User({
//     email:"abc@gmail.com",
//     username:"nisar",
//   })
//   let reguser=await User.register(fakeUser,"nisar@srfz")
//   res.send(reguser)
// })
// 🚨 IMPORTANT: It is NOT checking before routes

// You asked:

// “How does middleware check flash before routes?”

// ❌ It is NOT checking before route logic
// ✅ It is reading session data written in previous request

// 🧠 ONE-LINE RULE (REMEMBER THIS)

// Flash is written in Request A and read in Request B
// 🎯 FINAL SIMPLE ANSWER

// The middleware does NOT magically know messages.
// Flash messages were stored earlier in the session, and the middleware only reads them on the next request before rendering.
app.use("/listings",listingRoute);

app.use("/listings/:id/reviews",reviewRoute);

app.use("/",userRoute);




// app.all("*", (req, res, next) => {
//     next(new ExpressError(404, "Page Not Found"));
// });



app.use((req, res,next) => {
   next(new ExpressError(404,"page not found"))
});

// Global Error Handler Middleware (MUST be the last one)
app.use((err, req, res, next) => {
    // 1. Destructure the error object to get status and message
    let { status = 500, message = "Something went wrong!" } = err;

    // 2. Set the HTTP response status code
    res.status(status); 
    
    // 3. Render the error template and pass the variables it needs
    //    The template will receive: { status: 404, message: "Page Not Found" }
    res.render("error.ejs", { status, message });
});
app.listen(8080,(req,res)=>{
   console.log("list to port 8080")
})