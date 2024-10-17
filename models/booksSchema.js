const { default: mongoose } = require('mongoose') // Import the db connection

// Define the Book schema
const bookSchema = new mongoose.Schema({
  _id: mongoose.Schema.Types.ObjectId,
  title: { type: String, required: true },
  author: { type: String, required: true },
  genre: { type: String, required: true },
  availableCopies: { type: Number, required: true },
});

// Create and export the Book model

module.exports =mongoose.model('books', bookSchema);
