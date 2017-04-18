var express = require("express");
var app = express();

app.set("view engine", "ejs");

app.get("/", function(request, response) {
  response.render("landing");
});

app.listen(process.env.PORT, process.env.IP, function() {
  console.log("Server started");
})