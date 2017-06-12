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

router.post("/", function(request, response) {
  var name = request.body.name;
  var image = request.body.image;
  var description = request.body.description;
  var campground = {name: name, image: image, description: description};
  Campground.create(campground, function(err, campground) {
    if (err) {
      console.log(err);
    } else {
      response.redirect("/campgrounds");
    }
  });
});

router.get("/new", function(request, response) {
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

module.exports = router;
