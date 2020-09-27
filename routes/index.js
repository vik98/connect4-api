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
          color: "YELLOW",
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
            color: "RED",
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
            color: "YELLOW",
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
      /* Logic for the checks */
      const rows = await updatedGame.currentState.map((d) => {
        return d.join("");
      });

      for (let i = 0; i < rows.length; i++) {
        if (rows[i].includes("YYYY")) {
          updatedGame.winner = "YELLOW";
          updatedGame.gameOver = true;
          break;
        } else if (rows[i].includes("RRRR")) {
          updatedGame.winner = "RED";
          updatedGame.gameOver = true;
          break;
        }
      }
      const columns = ["", "", "", "", "", "", ""];

      for (let i = 0; i < 7; i++) {
        for (let j = 0; j < 6; j++) {
          columns[i] = columns[i].concat(rows[j].charAt(i));
        }
      }

      for (let i = 0; i < columns.length; i++) {
        if (columns[i].includes("YYYY")) {
          updatedGame.winner = "YELLOW";
          updatedGame.gameOver = true;
          break;
        } else if (columns[i].includes("RRRR")) {
          updatedGame.winner = "RED";
          updatedGame.gameOver = true;
          break;
        }
      }
    } else {
      updatedGame.validMove = false;
      updatedGame.comments = "Invalid move. Please make a valid move";
    }
  }
  //console.log(updatedGame);

  Game.findByIdAndUpdate(req.params.id, updatedGame, { new: true }, function (
    err,
    resultGame
  ) {
    if (err) console.log(err);
    res.send(resultGame);
  });
});

module.exports = router;
