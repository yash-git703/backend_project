const express = require('express')
const app = express()
const bodyParser = require('body-parser')
const mongoose = require("mongoose")
const db = require('./config/db')
const booksSchema = require('./models/booksSchema')
const authRoutes = require('./routes/auth')
const UserSchema= require("./models/users")
// const dashboard = require('./routes/bookRoutes')
const ejs = require('ejs') 
const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt');

app.use(bodyParser.json())

app.set("view engine","ejs")
app.use(express.json()) 
app.use(express.urlencoded({ extended: true }));
app.use(bodyParser.urlencoded({ extended: true }));



// // Login logic
app.get('/', (req, res) => {
  res.render('login');
});


app.post('/', async (req, res) => {
  const { username, password } = req.body;

  try {
      const user = await UserSchema.findOne({ username });
      if (!user) {
          console.log("User not found");
          return res.status(400).send("Wrong username or password.");
      }

      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
          console.log("Password mismatch");
          return res.status(400).send("Wrong username or password.");
      }

      res.redirect('/dashboard');
  } catch (error) {
      console.error("Error in login:", error);
      res.status(500).send("Error logging in. Please try again.");
  }
});




app.get('/signup',(req, res) => {
  res.render('signup')
})
app.post('/signup', async (req, res) => {
  const { username, password } = req.body;

  try {
    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);
    
    // Save the new user to the database
    const user = new UserSchema({ username, password: hashedPassword });
    await user.save();

    // Generate the JWT token
    const token = jwt.sign({ userId: user._id }, 'your_jwt_secret');

    // Render the token page and pass the token
    res.render('token', { token });

  } catch (error) {
    res.status(400).send("Error during signup.");
  }
});






// Route to render the add book form
app.get('/add', (req, res) => {
  res.render('add');
});




app.get('/signup',(req ,res) => {
  res.render('signup')

})





app.get('/search', async (req, res) => {
  const searchQuery = req.query.search; // Get the search term from query parameters

  try {
      let books;
      
      // Check if the search query is an ObjectId (for searching by ID)
      if (mongoose.Types.ObjectId.isValid(searchQuery)) {
          books = await booksSchema.find({ _id: searchQuery });
      } else {
          // Search by book genre (case-insensitive)
          books = await booksSchema.find({ genre: new RegExp(searchQuery, 'i') });
      }

      res.render('dashboard', { data: books });
  } catch (err) {
      console.error(err);
      res.status(500).send('Error during search');
  }
});




// Render the dashboard with all books data
app.get('/dashboard', (req, res) => {
  booksSchema.find()
      .then(books => {
          res.render('dashboard', { data: books});  // Pass the books data to the EJS file
      })
      .catch(err => {
          console.log(err);
          res.status(500).send('Failed to retrieve books data');
      });
});

// Render the Add Book form
app.get('/add', (req, res) => {
  
  res.render('add');
});

app.post('/add', (req, res) => {
  const { title, author, genre, availableCopies } = req.body;

  const newBook = new booksSchema({
      _id: new mongoose.Types.ObjectId(),  // Auto-generate ID
      title,
      author,
      genre,
      availableCopies
  });

  newBook.save()
      .then(() => {
          // Redirect to the /add page with a success message
          res.redirect('/dashboard');
      })
      .catch(err => res.send(err));
});



// Handle DELETE request for a book
app.get('/delete/:id', (req, res) => {
  booksSchema.deleteOne({ _id: req.params.id })
      .then(() => res.redirect('/dashboard'))  // Redirect to dashboard after deletion
      .catch(err => res.send(err));
});

// Render the Update Book form
app.get('/update/:id', (req, res) => {
  booksSchema.findById(req.params.id)
      .then(book => {
          res.render('update', { book });  // Render the form with book data to update
      })
      .catch(err => res.send(err));
});

// Handle PUT request to update book details
app.post('/update/:id', (req, res) => {
  const { title, author, genre, availableCopies } = req.body;

  booksSchema.findByIdAndUpdate(req.params.id, {
      title,
      author,
      genre,
      availableCopies
  })
  .then(() => res.redirect('/dashboard'))  // Redirect to dashboard after updating
  .catch(err => res.send(err));
});



// // Start the server
app.listen(3414, () => {
  console.log(`Server is running on http://localhost:3414/`);
})
