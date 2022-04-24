// Import express package
const express = require('express');
const notes = require('./db/db.json');
var path = require('path');
const fs = require('fs');
const PORT = 3001;

// Initialize our app variable by setting it to the value of express()
const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(express.static('public'));
// Add a static route for index.html
app.get('/', (req, res) => {
  // `res.sendFile` is Express' way of sending a file
  // `__dirname` is a variable that always returns the directory that your server is running in
  res.sendFile(path.join(__dirname, '/index.html'));
});
// Add routes for all APIs we are calling at index.js. viz /api/notes (GET, POST, DELETE (with ID) )

app.get('/notes', (req, res) => {
  console.log('we are redirecting notes page');
  res.sendFile(path.join(__dirname, 'public/notes.html'));
});

app.get('/api/notes', (req, res) => {
    console.log('we are getting all  notes');
    res.json(notes);
});

app.post('/api/notes', (req, res) => {
    console.log('we are posting a note : ');
    const {title, text} = req.body;
    const newNote = {
      title,
      text
    };
    fs.readFile('./db/db.json', 'utf8', (err, data) => {
      if (err) {
        console.error(err);
      } else {
        // Convert string into JSON object
        const allNotes = JSON.parse(data);

        // Add a new review
        allNotes.push(newNote);

        // Write updated reviews back to the file
        fs.writeFile(
          './db/db.json',
          JSON.stringify(allNotes, null, 4),
          (writeErr) =>
            writeErr
              ? console.error(writeErr)
              : console.info('Successfully updated notes!')
        );
      }
    });

    res.json(newNote);
});


app.listen(PORT, () =>
  console.log(`Example app listening at http://localhost:${PORT}`)
);
