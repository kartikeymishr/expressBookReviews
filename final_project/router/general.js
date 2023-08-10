const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();
const fs = require("fs");

const doesExist = (username) => {
    let userswithsamename = users.filter((user) => {
        return user.username === username
    });
    return userswithsamename.length > 0
}

public_users.post("/register", (req, res) => {
    const { username, password } = req.body;

    if (username && password) {
        if (!doesExist(username)) {
            users.push({ "username": username, "password": password })
            return res.status(200).json({ message: "User successfully registered. Now you can login." })
        } else {
            return res.status(404).json({ message: "User already exists!" })
        }
    }

    return res.status(404).json({ message: "Unable to register user." })
})

// Get the book list available in the shop
public_users.get('/', function (req, res) {
    const getBooks = new Promise((resolve, reject) => {
        resolve(res.send(JSON.stringify({ books }, null, 4)));
    });
    getBooks.then(() => console.log("Promise for fetching all books resolved"));
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn', function (req, res) {
    const { isbn } = req.params;

    const getBookByIsbn = new Promise((resolve, reject) => {
        resolve(res.send(books[isbn]));
    });
    getBookByIsbn.then(() => console.log("Promise for fetching book by ISBN resolved"));
});

// Get book details based on author
public_users.get('/author/:author', function (req, res) {
    const { author } = req.params;

    const getAuthor = new Promise((resolve, reject) => {
        let filteredBooks = []
        Object.entries(books).forEach(([key, value]) => {
            if (value.author === author) {
                filteredBooks.push(value)
            }
        });
        resolve(res.send(filteredBooks));
    });
    getAuthor.then(() => console.log("Promise for fetching books by author resolved"));
});

// Get all books based on title
public_users.get('/title/:title', function (req, res) {
    const { title } = req.params;

    const getBookbyTitle = new Promise((resolve, reject) => {
        let filteredBooks = []
        Object.entries(books).forEach(([key, value]) => {
            if (value.title === title) {
                filteredBooks.push(value)
            }
        });
        resolve(res.send(filteredBooks));
    });
    getBookbyTitle.then(() => console.log("Promise for fetching books by title resolved"));
});

//  Get book review
public_users.get('/review/:isbn', function (req, res) {
    const { isbn } = req.params;
    const reviews = books[isbn]?.reviews;

    if (reviews) {
        console.log(reviews)
        return res.status(200).json(reviews);
    } else {
        return res.status(404).json({ message: "No reviews found" });
    }
});

module.exports.general = public_users;
