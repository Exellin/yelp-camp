var express       = require("express"),
    app           = express(),
    bodyParser    = require('body-parser'),
    mongoose      = require("mongoose"),
    passport      = require("passport"),
    localStrategy = require("passport-local"),
    Campground    = require("./models/campground"),
    Comment       = require("./models/comment"),
    User          = require("./models/user"),
    seedDB        = require("./seeds");

mongoose.connect("mongodb://localhost/yelp_camp");
app.use(bodyParser.urlencoded({extended: true}));
app.set("view engine", "ejs");
app.use(express.static(__dirname + "/public"));
seedDB();

app.get("/", function(request, response){
  response.render("landing");
});

app.get("/campgrounds", function(request, response){
  Campground.find({}, function(err, campgrounds){
    if(err) {
      console.log(err);
    } else {
      response.render("campgrounds/index", {campgrounds: campgrounds});
    }
  });
});

app.post("/campgrounds", function(request, response) {
  var name = request.body.name;
  var image = request.body.image;
  var description = request.body.description;
  var campground = {name: name, image: image, description: description};
  Campground.create(campground, function(err, campground){
    if (err) {
      console.log(err);
    } else {
      response.redirect("/campgrounds");
    }
  });
});

app.get("/campgrounds/new", function(request, response) {
  response.render("campgrounds/new");
});

app.get("/campgrounds/:id", function(request, response) {
  Campground.findById(request.params.id).populate("comments").exec(function(err, campground){
    if (err) {
      console.log(err);
    } else {
      response.render("campgrounds/show", {campground: campground});
    }
  });
});

app.get("/campgrounds/:id/comments/new", function(request, response) {
  Campground.findById(request.params.id, function(err, campground) {
    if (err) {
      console.log(err);
    } else {
      response.render("comments/new", {campground: campground});
    }
  });
});

app.post("/campgrounds/:id/comments", function(request, response) {
  Campground.findById(request.params.id, function(err, campground) {
    if (err) {
      console.log(err);
      response.redirect("/campgrounds");
    } else {
      Comment.create(request.body.comment, function(err, comment) {
        if (err) {
          console.log(err);
        } else {
          campground.comments.push(comment);
          campground.save();
          response.redirect("/campgrounds/" + campground._id);
        }
      });
    }
  });
});

app.listen(process.env.PORT, process.env.IP, function(){
  console.log("Server started");
})