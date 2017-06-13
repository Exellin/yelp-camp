var express = require("express");
var router = express.Router();
var Campground = require("../models/campground");

router.get("/", function(request, response) {
  Campground.find({}, function(err, campgrounds) {
    if(err) {
      console.log(err);
    } else {
      response.render("campgrounds/index", {campgrounds: campgrounds});
    }
  });
});

router.post("/", isLoggedIn, function(request, response) {
  var name = request.body.name;
  var image = request.body.image;
  var description = request.body.description;
  var author = {
    id: request.user._id,
    username: request.user.username
  };
  var campground = {name: name, image: image, description: description, author: author};
  Campground.create(campground, function(err, campground) {
    if (err) {
      console.log(err);
    } else {
      response.redirect("/campgrounds");
    }
  });
});

router.get("/new", isLoggedIn, function(request, response) {
  response.render("campgrounds/new");
});

router.get("/:id", function(request, response) {
  Campground.findById(request.params.id).populate("comments").exec(function(err, campground) {
    if (err) {
      console.log(err);
    } else {
      response.render("campgrounds/show", {campground: campground});
    }
  });
});

function isLoggedIn(request, response, next) {
  if (request.isAuthenticated()) {
    return next();
  }
  response.redirect("/login");
}

module.exports = router;
