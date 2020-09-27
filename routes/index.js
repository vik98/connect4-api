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

router.get("/getGame", function (req, res, next) {
  res.render("getGame");
});

router.get("/:id", async function (req, res, next) {
  const game = await Game.findById(req.params.id).exec();
  res.json(game);
});

router.post("/:id/:columnNumber", async function (req, res, next) {
  const game = await Game.findById(req.params.id).exec();
  const updatedGame = JSON.parse(JSON.stringify(game));

  console.log(game.moves.length);
  if (game.gameOver) {
    updatedGame.comments = "Game is already over. Check the winner attribute";
  } else {
    if (game.currentState[0][req.params.columnNumber - 1] == 0) {
      updatedGame.validMove = true;
      updatedGame.comments =
        "Valid move. Please check the currentState and moves attribute";
      if (game.moves.length == 0) {
        updatedGame.moves[0] = {
          color: "Yellow",
          moveCount: 1,
          columnNumber: req.params.columnNumber,
        };
        for (let i = 5; i >= 0; i--) {
          if (game.currentState[i][req.params.columnNumber - 1] == 0) {
            updatedGame.currentState[i][req.params.columnNumber - 1] = "Y";
            break;
          }
        }
      } else {
        if ((updatedGame.moves.length + 1) % 2 == 0) {
          updatedGame.moves.push({
            color: "Red",
            moveCount: updatedGame.moves.length + 1,
            columnNumber: req.params.columnNumber,
          });
          for (let i = 5; i >= 0; i--) {
            if (game.currentState[i][req.params.columnNumber - 1] == 0) {
              updatedGame.currentState[i][req.params.columnNumber - 1] = "R";
              break;
            }
          }
        } else {
          updatedGame.moves.push({
            color: "Yellow",
            moveCount: updatedGame.moves.length + 1,
            columnNumber: req.params.columnNumber,
          });
          for (let i = 5; i >= 0; i--) {
            if (game.currentState[i][req.params.columnNumber - 1] == 0) {
              updatedGame.currentState[i][req.params.columnNumber - 1] = "Y";
              break;
            }
          }
        }
      }
    } else {
      updatedGame.validMove = false;
      updatedGame.comments = "Invalid move. Please make a valid move";
    }
  }
  console.log(updatedGame);

  Game.findByIdAndUpdate(req.params.id, updatedGame, { new: true }, function (
    err,
    resultGame
  ) {
    if (err) console.log(err);
    res.send(resultGame);
  });
});

module.exports = router;
