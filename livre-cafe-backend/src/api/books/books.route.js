const express = require('express');

const BooksController = require('./books.controller');

const BooksRouter = express.Router();

BooksRouter.route('/')
.get(BooksController.getAllBooks)
.post(BooksController.addBook);

BooksRouter.route('/:bookId')
.get(BooksController.getBook)
.put(BooksController.editBook)
.delete(BooksController.deleteBook);

module.exports = BooksRouter;