var express = require("express");
var router = express.Router();
const multer = require("multer");

const User = require("../models/User");
const Photo = require("../models/Photo");
const upload = multer({ dest: __dirname + "/../public/images/profile/" });

router.use((req, res, next) => {
  if (req.session.user) {
    // <== if there's user in the session (user is logged in)
    next(); // ==> go to the next route ---
  } else {
    //                                    |
    res.redirect("/auth/login"); //       |
  } //                                    |
}); // ------------------------------------
//     |
//     V

// PROFILE

router.get("/", (req, res, next) => {
  User.findById(req.session.user._id)
    .populate("profileImg")
    .populate("postActivity")

    // SUM TOTALS

    .then(user => {
      let totalDistance = 0;
      let totalHours = 0;
      let totalMinutes = 0;
      let NumActivities = user.postActivity.length;

      user.postActivity.forEach(activity => {
        totalDistance += activity.distance;
        totalHours += activity.hours;
        totalMinutes += activity.minutes;
      });

      var hours = totalMinutes / 60;
      var rhours = Math.floor(hours);
      var minutes = (hours - rhours) * 60;
      var rminutes = Math.round(minutes);
      // return num + " minutes = " + rhours + " hour(s) and " + rminutes + " minute(s).";
      let totalTime = totalHours + rhours;

      debugger;

      res.render("profile.hbs", {
        user,
        totalDistance: totalDistance,
        totalTime: totalTime,
        rminutes: rminutes,
        NumActivities: NumActivities
      });
    });
});

// UPLOAD PROFILE PICTURE

router.post("/profileImg/upload", upload.single("profileImg"), (req, res) => {
  Photo.create({
    photoNameId: req.file.filename,
    path: req.file.path,
    authour: req.session.user._id
  })
    .then(profileImg => {
      debugger;
      return User.findByIdAndUpdate(
        req.session.user._id,
        { profileImg: profileImg._id },
        { new: true }
      );
    })
    .then(user => {
      debugger;
      res.redirect("/profile");
    })
    .catch(err => {
      debugger;
      console.log(err);
    });
});

// router.post(
//   "/profileImg/upload",
//   upload.single("profileImg"),
//   async (req, res) => {
//     await User.findByIdAndUpdate(req.session.user._id, {
//       $set: { profileImg: req.file.filename }
//     });

//     res.redirect("/profile");
//   }
// );

module.exports = router;
