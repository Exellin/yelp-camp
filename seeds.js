var mongoose = require("mongoose");
var Campground = require("./models/campground");
var Comment = require("./models/comment");

var data = [
  {
      name: "Cloud's Rest",
      image: "https://farm4.staticflickr.com/3795/10131087094_c1c0a1c859.jpg",
      description: "foo"
  },
  {
      name: "Desert Mesa",
      image: "https://farm9.staticflickr.com/8673/15989950903_8185ed97c3.jpg",
      description: "bar"
  },
  {
      name: "Canyon Floor",
      image: "https://farm4.staticflickr.com/189/493046463_841a18169e.jpg",
      description: "fizz"
  }];


function seedDB() {
  Campground.remove({}, function(err) {
    if (err) {
      console.log(err);
    }
    console.log("removed campgrounds");
    data.forEach(function(seed) {
      Campground.create(seed, function(err, campground) {
        if(err) {
          console.log(err);
        } else {
          console.log("added a campground");
          Comment.create(
            {
              text: "this place is great",
              author: "Homer"
            }, function(err, comment) {
              if (err) {
                console.log(err);
              } else {
                campground.comments.push(comment);
                campground.save();
                console.log("created new comment");
              }
            }
          );
        }
      });
    });
  });
}

module.exports = seedDB;

