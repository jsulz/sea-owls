// Setting up our middleware for Express, Handlebars, and Body Parser as well as our connection to the MySQL DB
// Express
let express = require('express');
let app = express();
// MySQL connection
const mysql = require('./dbcon.js');
// Handlebars
let handlebars = require('express-handlebars')
	.create({
		defaultLayout:'main',
		partialsDir: ['views/partials']
	});
app.engine('handlebars', handlebars.engine);
app.set('view engine', 'handlebars');
app.set('port', 2201);

// Body Parser
let bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// And make sure that we have use of our public directory
app.use(express.static('public'));

const { index } = require( './routes/index' );
const { viewGenres, addGenres } = require( './routes/genres' );
const { viewAuthors, addAuthors } = require( './routes/authors' );
const { viewMembers, viewMember, addMember, addToReadingList, deleteMember } = require( './routes/members' );
const { viewBooks, viewBook, addBooks } = require( './routes/books' );
const { serverError, pageNotFound } = require( './routes/errors' );

// Homepage
app.get('/', index );

// View all members
app.get( '/members', viewMembers );
// View a single member
app.get( '/member/:memberID', viewMember );
// Add a new Member
app.post( '/members', addMember );
// Update a member's reading list
app.post( '/member/:memberID', addToReadingList );
// Delete a member from sea_owls
app.post( '/members', deleteMember );

// View all books
app.get( '/books', viewBooks );
// Vuew a single book
app.get( '/book/:bookID', viewBook );
// Add a new book
app.post( '/books', addBooks );

// View all genres
app.get( '/genres', viewGenres );
// Add a new genre
app.post( '/genres', addGenres );
// View all authors

app.get( '/authors', viewAuthors );
// Add an author
app.post( '/authors', addAuthors );

// It's good practice to include a 404 page, so we do
app.use( pageNotFound );

// And it's also good practice to include a 500 page, so we do
app.use( serverError );

// And this is just some output to let us know that the server is up
app.listen(app.get('port'), function(){
  console.log('Express started on port: ' + app.get('port') + '; press Ctrl-C to axe it.');
});
