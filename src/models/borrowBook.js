const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// const book = new mongoose.Schema(
//   {
//     post: { ref: "book", type: Schema.Types.ObjectId },
//     dateAdded: { type: Date, default: new Date() },
//     title: String,
//   },
//   { _id: false }
// );
// ({
// //   title: String,
// //   author: String,
// //   ISBN: String,

// });

// const SavedPostSchema = new Schema(
//   {
//     post: { ref: "post", type: Schema.Types.ObjectId },
//     dateAdded: { type: Date, default: new Date() },
//   },
//   { _id: false }
// );

const BorrowBooksSchema = new Schema(
  {
    book: {
      type: Schema.Types.ObjectId,
      ref: "Book",
      required: false,
      index: true,
    },
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("borrow_book", BorrowBooksSchema);
