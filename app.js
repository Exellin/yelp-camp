var express     = require("express"),
    app         = express(),
    bodyParser  = require('body-parser'),
    mongoose    = require("mongoose");

mongoose.connect("mongodb://localhost/yelp_camp");
app.use(bodyParser.urlencoded({extended: true}));
app.set("view engine", "ejs");

var campgroundSchema = new mongoose.Schema({
  name: String,
  image: String
});

var Campground = mongoose.model("Campground", campgroundSchema );

app.get("/", function(request, response){
  response.render("landing");
});

app.get("/campgrounds", function(request, response){
  Campground.find({}, function(err, campgrounds){
    if(err) {
      console.log(err);
    } else {
      response.render("campgrounds", {campgrounds: campgrounds});
    }
  });
});

app.post("/campgrounds", function(request, response){
  var name = request.body.name;
  var image = request.body.image;
  var newCampground = {name: name, image: image};
  Campground.create(newCampground, function(err, newCampground){
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

app.listen(process.env.PORT, process.env.IP, function(){
  console.log("Server started");
})