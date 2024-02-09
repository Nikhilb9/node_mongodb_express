const mongoose = require("mongoose");
const { uuid } = require("uuidv4");
const Schema = mongoose.Schema;

const booksSchema = new Schema({
  title: {
    type: String,
    required: true,
    unique: true,
  },
  author: {
    type: String,
    required: true,
  },
  ISBN: {
    type: String,
    required: true,
  },
  quantityAvailable: {
    type: Number,
    required: true,
    default: 0,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("Book", booksSchema);
