// Import express package
const express = require('express');
var path = require('path');
const fs = require('fs');
const { v4: uuidv4 } = require('uuid');

const PORT = 3001;

// Initialize our app variable by setting it to the value of express()
const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(express.static('public'));
// Add a static route for index.html
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '/index.html'));
});

// Add routes for all APIs we are calling at index.js. viz /api/notes (GET, POST, DELETE (with ID) )

app.get('/notes', (req, res) => {
  // we are redirecting notes page
  res.sendFile(path.join(__dirname, 'public/notes.html'));
});

app.get('/api/notes', (req, res) => {
    // we are getting all  notes
    fs.readFile('./db/db.json', 'utf8', (err, data) => {
      if (err) {
        console.error(err);
      } else {
         res.send(data);
      }
    });

});

app.post('/api/notes', (req, res) => {
    const {title, text} = req.body;
    const newNote = {
      "id": uuidv4(),
      title,
      text
    };
    fs.readFile('./db/db.json', 'utf8', (err, data) => {
      if (err) {
        console.error(err);
      } else {
        // Convert string into JSON object
        const allNotes = JSON.parse(data);
        // Add a new note
        allNotes.push(newNote);
        // Write updated notes back to the file
        fs.writeFile(
          './db/db.json',
          JSON.stringify(allNotes),
          (writeErr) => {
            if(writeErr){
               console.error(writeErr)
              }
              else{ 
                const response = {
                  status: 'success',
                  body: newNote,
                };
                res.json(response);
            }
          }
        );
      }
    });
   
});

app.delete( '/api/notes/:id', (req,res) => {
  const deletionID = req.params.id;
  fs.readFile('./db/db.json','UTF-8', (err, data) => {
      if(err){
        console.log(err);
      }else{
        
        
          let modifiedNotes = (JSON.parse(data)).filter( note => note.id!= deletionID );
          fs.writeFile(
            './db/db.json',
            JSON.stringify(modifiedNotes),
            (writeErr) => {
              if(writeErr){
                 console.error(writeErr)
                }
                else{ 
                  const deletionResponse = {
                    status: 'success',
                    body: 'Deletion Successful',
                  };
                  res.json(deletionResponse);
              }
            }
          );

        }
      
  });
});

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '/index.html'));
});
app.listen(PORT, () =>
  console.log(`Example app listening at http://localhost:${PORT}`)
);
