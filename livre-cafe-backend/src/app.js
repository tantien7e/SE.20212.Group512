const express = require('express');
const cors = require('cors');

const BooksRouter = require('./api/books/books.route');
const DrinksRouter = require('./api/drinks/drinks.route');

const app = express();

app.use(cors({
    origin: "*"
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/books', BooksRouter);
app.use('/drinks', DrinksRouter);

module.exports = app;