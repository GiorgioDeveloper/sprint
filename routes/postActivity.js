const express = require("express");
const router = express.Router();
const multer = require("multer");

const User = require("../models/User");
const Photo = require("../models/Photo");
const upload = multer({ dest: __dirname + "/../public/images/album/" });
const PostActivity = require("../models/PostActivity");

// image:require the Photo model (A)
// image:let multer parse the image (B)
router.post("/", upload.single("photo"), (req, res) => {
  // when we create a post we need to populate three fields.
  // we receive sport and description from a form.
  const { sport, description, distance, hours, minutes, location } = req.body;

  // the user id (which we need to establish as relation) we get from the session
  const id = req.session.user._id;
  // image:First create the Photo (C)

  Photo.create({
    photoNameId: req.file.filename,
    path: req.file.path,
    authour: req.session.user._id
  })

    .then(photo => {
      return PostActivity.create({
        sport: sport,
        description: description,
        distance: distance,
        hours: hours,
        minutes: minutes,
        location: location,
        author: id,
        photo: photo._id
        // image:
        // image:insert the objectId of the Photo just created at C (D)
      });
    })
    .catch(err => {
      debugger;
      console.log(err);
    })
    .then(post => {
      // after we've created a post we can update the user document who created the post
      // we know which user to update, because it's the current user that's been logged in
      // the second object pushes the id of the post in the user.posts array
      return User.findByIdAndUpdate(
        id,
        { $push: { postActivity: post._id } },
        { new: true }
      );
    })
    .then(updatedUser => {
      res.redirect("/activities");
    });
});

// DELETE Activity

router.get("/delete/:id", (req, res) => {
  PostActivity.findByIdAndDelete(req.params.id)
    .then(user => {
      res.redirect("/activities");
    })
    .catch(err => {
      res.send(err);
    });
});

// EDIT Activity

router.get("/edit/:id", (req, res) => {
  //Find activity by id
  //res show form
  PostActivity.findById(req.params.id)
    .populate("photo")
    .then(activity => {
      res.render("updateActivity", {
        activity: activity,
        route: `/postActivity/edit/${activity._id}`
      });
    })
    .catch(err => {
      console.log(err);
    });
});

router.post("/edit/:id", upload.single("photo"), (req, res) => {
  PostActivity.findByIdAndUpdate({ _id: req.params.id }, req.body)
    .then(newActivity => {
      if (req.file) {
        debugger;
        return Photo.findByIdAndUpdate(newActivity.photo, {
          photoNameId: req.file.filename,
          path: req.file.path
        });
      }
      return newActivity;
    })
    .then(() => {
      res.redirect("/activities");
    })
    .catch(err => {
      console.log(err);
    });
});

module.exports = router;

// get the postActivity from the user model
// populate it instead of getting the ID
// render it in the fee hbs file
