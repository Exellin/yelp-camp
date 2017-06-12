var express = require("express");
var router = express.Router({mergeParams: true});
var Campground = require("../models/campground");
var Comment = require("../models/comment");

router.get("/new", isLoggedIn, function(request, response) {
  Campground.findById(request.params.id, function(err, campground) {
    if (err) {
      console.log(err);
    } else {
      response.render("comments/new", {campground: campground});
    }
  });
});

router.post("/", isLoggedIn, function(request, response) {
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

function isLoggedIn(request, response, next) {
  if (request.isAuthenticated()) {
    return next();
  }
  response.redirect("/login");
}

module.exports = router;