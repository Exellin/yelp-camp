var Campground = require("../models/campground");
var Comment = require("../models/comment");

var middleware = {};

middleware.checkCampgroundOwnership = function(request, response, next) {
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
};

middleware.checkCommentOwnership = function(request, response, next) {
  if (request.isAuthenticated()) {
    Comment.findById(request.params.comment_id, function(err, comment) {
      if (err) {
        response.redirect("back");
      } else {
        if (comment.author.id.equals(request.user._id)) {
          next();
        } else {
          response.redirect("back");
        }
      }
    });
  } else {
    response.redirect("back");
  }
};

middleware.isLoggedIn = function(request, response, next) {
  if (request.isAuthenticated()) {
    return next();
  }
  response.redirect("/login");
};

module.exports(middleware);
