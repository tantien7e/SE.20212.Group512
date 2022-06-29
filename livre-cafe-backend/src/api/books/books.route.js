const express = require('express');

const BooksController = require('./books.controller');
const isManager = require('../../auth/authorize');

/**
 * @swagger
 * components:
 *  schemas:
 *      Book:
 *          type: object
 *          required:
 *              - title
 *              - author
 *              - stock
 *              - price
 *          properties:
 *              id:
 *                  type: string
 *                  description: the auto-generated id
 *              title:
 *                  type: string
 *                  description: the book title
 *              author:
 *                  type: string
 *                  description: the book author
 *              stock:
 *                  type: number
 *                  description: the number of books in stock
 *              price:
 *                  type: number
 *                  description: the book price
 */

/**
 * @swagger
 * tags:
 *  name: Books
 *  description: Books API
 */


const BooksRouter = express.Router();

/**
 * @swagger
 * /books:
 *  get:
 *      summary: Returns the list of all books
 *      tags: [Books]
 *  post:
 *      summary: Add new book
 *      tags: [Books]
 */

BooksRouter.route('/')
.get(BooksController.getAllBooks)
.post(isManager, BooksController.addBook);

/**
 * @swagger
 * /books/{id}:
 *  get:
 *      summary: Get the book by id
 *      tags: [Books]
 *  put:
 *      summary: Update the book
 *      tags: [Books]
 *  delete:
 *      summary: Remove the book
 *      tags: [Books]
 */

BooksRouter.route('/:bookId')
.get(BooksController.getBook)
.put(isManager, BooksController.editBook)
.delete(isManager, BooksController.deleteBook);

module.exports = BooksRouter;