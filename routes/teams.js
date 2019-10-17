var express = require("express");
var router = express.Router();
const authorisationMiddleWare = require("./authorisationMiddleWare");

/* GET teams listing. */
router.get("/", authorisationMiddleWare, function(req, res, next) {
  res.render("teams");
});

module.exports = router;
