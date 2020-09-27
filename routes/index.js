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

router.post("/:id/:columnNumber", async function (req, res, next) {
  //console.log(req.params.id);
  const game = await Game.findById(req.params.id).exec();
  const updatedGame = JSON.parse(JSON.stringify(game));
  // if (game.moves.length == 0) {
  //   updatedGame = new Game({
  //     currentState: game.currentState,
  //     moves: [
  //       {
  //         color: "Yellow",
  //         moveCount: 1,
  //         columnNumber: req.params.columnNumber,
  //       },
  //     ],
  //     validMove: game.validMove,
  //     winner: game.winner,
  //     gameOver: game.gameOver,
  //   });
  //   console.log(updatedGame);
  // } else {
  // }

  if (game.gameOver) {
    updatedGame.comments = "Game is already over. Check the winner attribute";
  } else {
    if (game.currentState[0][req.params.columnNumber - 1] == 0) {
      updatedGame.validMove = true;
      updatedGame.comments =
        "Valid move. Please check the currentState attribute";
    } else {
      updatedGame.validMove = false;
      updatedGame.comments = "Invalid move. Please make a valid move";
    }
  }
  console.log(updatedGame);
  // Game.findById(req.params.id, function (err, game) {
  //   if (err) console.log(err);
  //   //console.log(game.moves.length);
  //   if (game.moves.length == 0) {
  //     const updatedGame = new Game({
  //       currentState: game.currentState,
  //       moves: [
  //         {
  //           color: "Yellow",
  //           moveCount: 1,
  //           columnNumber: req.params.columnNumber,
  //         },
  //       ],
  //       validMove: game.validMove,
  //       winner: game.winner,
  //       gameOver: game.gameOver,
  //     });
  //     console.log(updatedGame);
  //   }
  // });
});

module.exports = router;
