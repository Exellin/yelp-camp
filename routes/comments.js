var express = require("express");
var router = express.Router({mergeParams: true});
var Campground = require("../models/campground");
var Comment = require("../models/comment");
var middleware = require("../middleware");

router.get("/new", middleware.isLoggedIn, function(request, response) {
  Campground.findById(request.params.id, function(err, campground) {
    if (err) {
      console.log(err);
    } else {
      response.render("comments/new", {campground: campground});
    }
  });
});

router.post("/", middleware.isLoggedIn, function(request, response) {
  Campground.findById(request.params.id, function(err, campground) {
    if (err) {
      console.log(err);
      response.redirect("/campgrounds");
    } else {
      Comment.create(request.body.comment, function(err, comment) {
        if (err) {
          console.log(err);
        } else {
          comment.author.id = request.user._id;
          comment.author.username = request.user.username;
          comment.save();
          campground.comments.push(comment);
          campground.save();
          response.redirect("/campgrounds/" + campground._id);
        }
      });
    }
  });
});

router.get("/:comment_id/edit", middleware.checkCommentOwnership, function(request, response) {
  Comment.findById(request.params.comment_id, function(err, comment) {
    if (err) {
      response.redirect("back");
    } else {
      response.render("comments/edit", {campground_id: request.params.id, comment: comment});
    }
  });
});

router.put("/:comment_id", middleware.checkCommentOwnership, function(request, response) {
  Comment.findByIdAndUpdate(request.params.comment_id, request.body.comment, function(err, comment) {
    if (err) {
      response.redirect("back");
    } else {
      response.redirect("/campgrounds/" + request.params.id);
    }
  });
});

router.delete("/:comment_id", middleware.checkCommentOwnership, function(request, response) {
  Comment.findByIdAndRemove(request.params.comment_id, function(err) {
    if (err) {
      response.redirect("back");
    } else {
      request.flash("success", "Comment deleted");
      response.redirect("/campgrounds/" + request.params.id);
    }
  });
});

module.exports = router;
