const Books = require('../../models/books/books.model');

const getAllBooks = async (req, res) => {
    const books = await Books.find({});
    res.status(200).json(books);
}

const getBook = async (req, res) => {
    const book = await Books.findById(req.params.bookId);
    if (book) {
        res.status(200).json(book);
    } else {
        res.status(404).json({ message: "Book not found" });
    }
}

const deleteBook = async (req, res) => {
    const book = await Books.findByIdAndDelete(req.params.bookId);
    if (book) {
        res.status(200).json({ message: "Delete successfully" });
    } else {
        res.status(404).json({ message: "Book not found"});
    }
}

const editBook = async (req, res) => {
    const book = await Books.findByIdAndUpdate(req.params.bookId, {
        $set: req.body
    }, {
        new: true
    });
    if (book) {
        res.status(200).json({ message: "Update successfully"});
    } else {
        res.status(404).json({ message: "Book not found"});
    }
}

const addBook = async (req, res) => {
    const book = await Books.create(req.body);
    res.status(200).json(book);
}

module.exports = {
    getAllBooks,
    getBook,
    deleteBook,
    editBook,
    addBook
}