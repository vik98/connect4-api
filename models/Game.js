const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const gameSchema = new Schema({
  currentState: {
    type: [Schema.Types.Mixed],
    default: [
      [0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0],
    ],
  },
  moves: [
    {
      color: {
        type: String,
        default: "No color as this move is the first and default move",
      },
      moveCount: { type: Number, default: 0 },
      columnNumber: { type: Number, default: -1 },
    },
  ],
  validMove: { type: Boolean, default: true },
  winner: { type: String, default: "NA" },
  gameOver: { type: Boolean, default: false },
  comments: { type: String, default: "No comments as of now" },
});

module.exports = mongoose.model("Game", gameSchema);
