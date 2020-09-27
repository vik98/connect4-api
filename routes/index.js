var express = require("express");
var router = express.Router();
var mongoose = require("mongoose");
var Game = require("../models/Game");

/* GET home page. */
router.get("/", function (req, res, next) {
  res.render("index", { title: "Connect 4 API" });
});

router.get("/startNewGame", function (req, res, next) {
  const game = new Game();
  game
    .save()
    .then((doc) => {
      res.render("newGame", { id: doc._id });
    })
    .catch((err) => console.log(err));
});

router.post("/:id/:columnNumber", function (req, res, next) {
  console.log(req.params.id);
  Game.findById(req.params.id, function (err, game) {
    if (err) console.log(err);
    console.log(game);
    res.send(game);
  });
});

module.exports = router;
