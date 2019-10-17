function authorisationMiddleWare(req, res, next) {
  if (req.session.user) {
    // <== if there's user in the session (user is logged in)
    next(); // ==> go to the next route ---
  } else {
    //    |
    res.redirect("/auth/login"); //    |
  } //    |
} // ------------------------------------
//     |
//     V

module.exports = authorisationMiddleWare;
