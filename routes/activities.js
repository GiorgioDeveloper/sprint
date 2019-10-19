var express = require("express");
var router = express.Router();
var moment = require("moment");
moment().format();
const authorisationMiddleWare = require("./authorisationMiddleWare");
const User = require("../models/User");

router.get("/", authorisationMiddleWare, (req, res) => {
  debugger;
  User.findById(req.session.user._id)
    .populate({
      //populate User with postActivity
      path: "postActivity",
      //populate postActivity with photo
      populate: {
        path: "photo",
        model: "Photo"
      }
    })
    .then(user => {
      // DATE CORRECT FORMAT
      //create newUser to transform the model user into an object
      //create a var posts to store all the modified post (with new key dateString)
      //do a for each to go through all postActivity of the object newUser, and we call the result post
      //add a new key name dateString into the post, and we attribute it using moment library method
      //push it into the var posts
      //pass posts to activities.hbs
      debugger;

      var newUser = user.toObject();

      var posts = [];

      newUser.postActivity.forEach(post => {
        debugger;
        post.dateString = moment(post.createdAt).format("MMM Do YY");
        posts.push(post);
      });
      debugger;
      res.render("activities.hbs", { posts });
      debugger;
    });
});

module.exports = router;
