const express = require("express");
const Book = require("../models/book");
const router = express.Router();
const { validate } = require("express-validation");
const validator = require("../validation");
const User = require("../models/user");
const { jwtService } = require("../jwtService");
const BorrowBook = require("../models/borrowBook");

//User Routes

//Register User
router.post(
  "/user/register",
  validate(validator.validateRegisterUser, {}, {}),
  async (req, res) => {
    try {
      const { email } = req.body;
      //Check email exist or not
      const user = await User.findOne({ email: email });
      if (user) {
        throw "User Exist";
      }
      const createdUser = await User.create(req.body);
      const token = await jwtService.generateToken({
        email: createdUser.email,
        name: createdUser.name,
      });
      await User.updateOne({ email: email }, { token: token });
      return res.status(200).send({ user: createdUser, token: token });
    } catch (err) {
      return res.status(404).send({ error: err });
    }
  }
);
//Login User
router.post(
  "/user/login",
  validate(validator.validateLoginUser),

  async (req, res) => {
    try {
      const { email, password } = req.body;
      const isUserExist = await User.findOne({
        email: email,
        password: password,
      });
      if (!isUserExist) {
        throw "User Does Not Exist";
      }
      const token = await jwtService.generateToken({
        email: isUserExist.email,
        name: isUserExist.name,
      });
      await User.updateOne({ email: email }, { token: token });
      return res.status(200).send({ token: token });
    } catch (err) {
      return res.status(404).send({ error: err });
    }
  }
);

//Books Route

router.post(
  "/book",
  validate(validator.validateCreateBook, {}, {}),
  jwtService.verifyToken,
  async (req, res) => {
    try {
      const { title, author, ISBN, quantityAvailable } = req.body;
      const isTitleExist = await Book.findOne({ title: title });
      if (isTitleExist) {
        throw "Title already exist";
      }
      const book = await Book.create({
        title: title,
        author: author,
        ISBN: ISBN,
        quantityAvailable: quantityAvailable,
      });
      return res.status(200).send({ book: book });
    } catch (err) {
      return res.status(404).send({ error: err });
    }
  }
);

router.get(
  "/book/list",
  validate(validator.validateCreateBook, {}, {}),
  jwtService.verifyToken,
  async (req, res) => {
    try {
      const books = await Book.find({ quantityAvailable: { $gt: 0 } });
      return res.status(200).send({ book: books });
    } catch (err) {
      return res.status(404).send({ error: err });
    }
  }
);

router.get("/book/:id", jwtService.verifyToken, async (req, res) => {
  try {
    const isBookExist = await Book.findOne({ _id: req.params.id });
    if (!isBookExist) {
      throw "Invalid Id";
    }
    return res.status(200).send({ book: isBookExist });
  } catch (err) {
    return res.status(404).send({ error: err });
  }
});

router.get(
  "/borrow/:bookId/:userId",
  jwtService.verifyToken,
  async (req, res) => {
    try {
      const book = await Book.findOne({
        _id: req.params.bookId,
        quantityAvailable: { $gt: 0 },
      });
      if (!book) {
        throw "Book not available";
      }

      const isUserExist = await User.findOne({ _id: req.params.userId });
      if (!isUserExist) {
        throw "Invalid UserId";
      }
      await BorrowBook.create({
        book: book,
        user: isUserExist,
      });
      await Book.updateOne(
        { _id: req.params.bookId },
        { quantityAvailable: book.quantityAvailable - 1 }
      );
      return res.status(200).send({ book: "Book borrowed successfully" });
    } catch (err) {
      return res.status(404).send({ error: err });
    }
  }
);

router.get(
  "/return/:bookId/:userId",
  jwtService.verifyToken,
  async (req, res) => {
    try {
      const book = await Book.findOne({
        _id: req.params.bookId,
      });
      if (!book) {
        throw "Invalid bookId";
      }

      const isUserExist = await User.findOne({ _id: req.params.userId });
      if (!isUserExist) {
        throw "Invalid UserId";
      }
      await BorrowBook.deleteOne({
        book: book,
        user: isUserExist,
      });
      await Book.updateOne(
        { _id: req.params.bookId },
        { quantityAvailable: book.quantityAvailable + 1 }
      );
      return res.status(200).send({ book: "Book return successfully" });
    } catch (err) {
      return res.status(404).send({ error: err });
    }
  }
);

router.get("/user/books/:userId", jwtService.verifyToken, async (req, res) => {
  try {
    const isUserExist = await User.findOne({ _id: req.params.userId });
    if (!isUserExist) {
      throw "Invalid UserId";
    }
    const borrowBooks = await BorrowBook.find({
      user: isUserExist._id,
    })
      .select("_id")
      .populate("book");

    return res.status(200).send({ book: borrowBooks });
  } catch (err) {
    return res.status(404).send({ error: err });
  }
});
module.exports = router;
