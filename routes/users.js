var express = require("express");
var router = express.Router();
const multer = require("multer");
const User = require("../models/User");
const Photo = require("../models/Photo");
const upload = multer({ dest: __dirname + "/../public/images/profile/" });
const PostActivity = require("../models/PostActivity");

// /profile
router.get("/", (req, res) => {
  debugger;
  User.findById(req.session.user._id)

    .populate("profileImg")
    .then(user => {
      res.render("profile.hbs", { user });
    });
});

module.exports = router;
