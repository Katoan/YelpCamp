var express     = require("express"),
    app         = express(),
    bodyParser  = require("body-parser"),
    mongoose    = require("mongoose"),
    flash       = require("connect-flash"),
    passport    = require("passport"),
    LocalStrategy = require("passport-local"),
    Campground  = require("./models/campground"),
    methodOverride = require("method-override"),
    Comment     = require("./models/comment"),
    User        = require("./models/user"),
    seedDB      = require("./seeds")

var commentRoutes       = require("./routes/comments"),
    campgroundRoutes    = require("./routes/campgrounds"),
    indexRoutes          = require("./routes/index")
//First attempt creates a dir named yelp_camp to mongo
//Then connect to it
mongoose.connect("mongodb://localhost/yelp_camp_v13", {
    useMongoClient: true,
});

//Allows us to use req.body (Parses body)
app.use(bodyParser.urlencoded({extended: true}));
//Removes the need to add .ejs to end of files
app.set("view engine", "ejs");
app.use(express.static(__dirname + "/public"));
app.use(methodOverride("_method"));
app.use(flash());
//seedDB();


//PASSPORT CONFIG
app.use(require("express-session")({
    secret: "kekkonen tulee oletko valmis",
    resave: false,
    saveUninitialized: false
}));

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());


app.use(function(req, res, next){
    res.locals.currentUser = req.user;
    res.locals.error = req.flash("error");
    res.locals.success = req.flash("success");
    next();
});

app.use("/", indexRoutes);
app.use("/campgrounds", campgroundRoutes);
app.use("/campgrounds/:id/comments", commentRoutes);


//Makes server run
app.listen(process.env.PORT, process.env.IP, function(){
    console.log("piip");
});