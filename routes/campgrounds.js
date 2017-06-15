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

router.get("/:id/edit", checkCampgroundOwnership, function(request, response) {
  Campground.findById(request.params.id, function(err, campground) {
    response.render("campgrounds/edit", {campground: campground});
  });
});

router.put("/:id", checkCampgroundOwnership, function(request, response) {
  Campground.findByIdAndUpdate(request.params.id, request.body.campground, function(err, campground) {
    if (err) {
      response.redirect("/campgrounds");
    } else {
      response.redirect("/campgrounds/" + request.params.id);
    }
  });
});

router.delete("/:id", checkCampgroundOwnership, function(request, response) {
  Campground.findByIdAndRemove(request.params.id, function(err) {
    if (err) {
      response.redirect("/campgrounds");
    } else {
      response.redirect("/campgrounds");
    }
  });
});

function isLoggedIn(request, response, next) {
  if (request.isAuthenticated()) {
    return next();
  }
  response.redirect("/login");
}

function checkCampgroundOwnership(request, response, next) {
  if (request.isAuthenticated()) {
    Campground.findById(request.params.id, function(err, campground) {
      if (err) {
        response.redirect("back");
      } else {
        if (campground.author.id.equals(request.user._id)) {
          next();
        } else {
          response.redirect("back");
        }
      }
    });
  } else {
    response.redirect("back");
  }
}

module.exports = router;
