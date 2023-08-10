const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

const isValid = (username) => { //returns boolean
    //write code to check is the username is valid
}

const authenticatedUser = (username, password) => { //returns boolean
    let validUsers = users.filter((user) => {
        return (user.username === username && user.password === password)
    })

    return validUsers.length > 0;
}

//only registered users can login
regd_users.post("/login", (req, res) => {
    const { username, password } = req.body;

    if (!username || !password) {
        return res.status(404).json({ message: "Error logging in." })
    }

    if (authenticatedUser(username, password)) {
        let accessToken = jwt.sign({
            data: password
        }, "access", { expiresIn: 60 * 60 })

        req.session.authorization = {
            accessToken, username
        }

        return res.status(200).send("User successfully logged in.")
    } else {
        return res.status(200).json({ message: "Invalid login. Check credentials." })
    }
});

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
    const { isbn } = req.params;
    const book = books[isbn];

    if (book) {
        const review = req.body;
        review.id = book.reviews.length + 1;
        review.author = req.session.authorization.username;
        book.reviews.push(review);
        return res.status(200).json(book);
    } else {
        return res.status(404).json({ message: "No book found." })
    }
});

regd_users.delete("/auth/review/:isbn", (req, res) => {
    const { isbn } = req.params;
    const book = books[isbn];

    console.log(req.session.authorization.username);

    const username = req.session.authorization.username;
    if (book) {
        book.reviews = book.reviews.filter((r) => r.author !== username);
        return res.status(200).json(book);
    } else {
        return res.status(404).json({ message: "No book found." })
    }
})

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
