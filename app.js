var express     = require("express"),
    app         = express(),
    bodyParser  = require('body-parser'),
    mongoose    = require("mongoose"),
    Campground  = require("./models/campground");

mongoose.connect("mongodb://localhost/yelp_camp");
app.use(bodyParser.urlencoded({extended: true}));
app.set("view engine", "ejs");

app.get("/", function(request, response){
  response.render("landing");
});

app.get("/campgrounds", function(request, response){
  Campground.find({}, function(err, campgrounds){
    if(err) {
      console.log(err);
    } else {
      response.render("index", {campgrounds: campgrounds});
    }
  });
});

app.post("/campgrounds", function(request, response){
  var name = request.body.name;
  var image = request.body.image;
  var description = request.body.description;
  var campground = {name: name, image: image, description: description};
  Campground.create(campground, function(err, campground){
    if(err) {
      console.log(err);
    } else {
      response.redirect("/campgrounds");
    }
  });
});

app.get("/campgrounds/new", function(request, response){
  response.render("new.ejs");
});

app.get("/campgrounds/:id", function(request, response){
  Campground.findById(request.params.id, function(err, campground){
    if(err){
      console.log(err);
    } else {
      response.render("show", {campground: campground});
    }
  });
});

app.listen(process.env.PORT, process.env.IP, function(){
  console.log("Server started");
})