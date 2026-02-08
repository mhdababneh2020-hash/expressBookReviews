const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();

// Register a new user
public_users.post("/register", (req,res) => {
  const username = req.body.username;
  const password = req.body.password;

  if (!username || !password) {
    return res.status(400).json({message: "Username and password are required"});
  }

  let userExists = users.find(user => user.username === username);
  if (userExists) {
    return res.status(409).json({message: "Username already exists"});
  }

  users.push({username: username, password: password});
  return res.status(200).json({message: "User registered successfully"});
});

// Task 10: Get the book list available in the shop using async/await (Promise style)
public_users.get('/', async (req, res) => {
  try {
    return res.status(200).json(books);
  } catch (error) {
    return res.status(500).json({ message: "Error fetching books", error: error.message });
  }
});

// Task 11: Get book details based on ISBN using async/await
public_users.get('/isbn/:isbn', async (req, res) => {
  try {
    const isbn = req.params.isbn;
    const book = books[isbn];
    if (!book) {
      return res.status(404).json({ message: "Book not found" });
    }
    return res.status(200).json(book);
  } catch (error) {
    return res.status(500).json({ message: "Error fetching book by ISBN", error: error.message });
  }
});

// Task 12: Get book details based on author using async/await
public_users.get('/author/:author', async (req, res) => {
  try {
    const author = req.params.author;
    const result = Object.values(books).filter(book => book.author === author);
    if (result.length === 0) {
      return res.status(404).json({ message: "No books found for this author" });
    }
    return res.status(200).json(result);
  } catch (error) {
    return res.status(500).json({ message: "Error fetching books by author", error: error.message });
  }
});

// Task 13: Get book details based on title using async/await
public_users.get('/title/:title', async (req, res) => {
  try {
    const title = req.params.title;
    const result = Object.values(books).filter(book => book.title === title);
    if (result.length === 0) {
      return res.status(404).json({ message: "No books found with this title" });
    }
    return res.status(200).json(result);
  } catch (error) {
    return res.status(500).json({ message: "Error fetching books by title", error: error.message });
  }
});

// Get book review (can stay synchronous if not required to change)
public_users.get('/review/:isbn', (req, res) => {
  const isbn = req.params.isbn;
  if (books[isbn]) {
    return res.status(200).send(JSON.stringify(books[isbn].reviews, null, 2));
  } else {
    return res.status(404).json({ message: "Book not found" });
  }
});

module.exports.general = public_users;
