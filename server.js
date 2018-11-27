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
const { viewGenres, addGenres, deleteGenre, updateGenre } = require( './routes/genres' );
const { viewAuthors, addAuthors, deleteAuthor, updateAuthor } = require( './routes/authors' );
const { viewMembers, viewMember, addMember, addToReadingList, deleteMember, deleteFromReadingList } = require( './routes/members' );
const { viewBooks, viewBook, addBooks, deleteBook } = require( './routes/books' );
const { serverError, pageNotFound } = require( './routes/errors' );

// Homepage
app.get('/', index );

// View all members
app.get( '/members', viewMembers );
// View a single member
app.get( '/member/:memberID', viewMember );
// Add or delete a member
app.post( '/members', ( req, res, next ) => {

	// Add a new Member
	if( req.body['add'] ){
		addMember( req, res, next );
	} 
	// Delete the specified Member
	else if ( req.body['delete'] ){
		deleteMember( req, res, next );
	}

});
// Add to a member's reading list
app.post( '/member/:memberID', (req, res, next ) => {

	if( req.body['add-to-reading-list'] ){
		addToReadingList( req, res, next );
	} else if ( req.body['delete'] ){
		deleteFromReadingList( req, res, next );
	}

} );

// View all books
app.get( '/books', viewBooks );
// Vuew a single book
app.get( '/book/:bookID', viewBook );
// Add or delete a book
app.post( '/books', ( req, res, next ) => {

	// Add a new book
	if( req.body['add'] ){
		addBooks( req, res, next );
	} 
	// Delete the specified book
	else if ( req.body['delete'] ){
		deleteBook( req, res, next );
	}

});


// View all genres
app.get( '/genres', viewGenres );
// Add, Delete, and Update genres
app.post( '/genres', ( req, res, next ) => {

	// Add a new genre
	if( req.body['add'] ){
		addGenres( req, res, next );
	} 
	// Delete the specified genre
	else if ( req.body['delete'] ){
		deleteGenre( req, res, next );
	}
	//Update genre name with new value
	else if ( req.body['edit'] ){
		updateGenre( req, res, next );
	}

});

// View all authors
app.get( '/authors', viewAuthors );
// Add an author
app.post( '/authors', ( req, res, next ) => {

	// Add a new author
	if( req.body['add'] ){
		addAuthors( req, res, next );
	} 
	// Delete the specified author
	else if ( req.body['delete'] ){
		deleteAuthor( req, res, next );
	}
	// Update author
	else if ( req.body['edit'] ){
		updateAuthor( req, res, next );
	}

});

// It's good practice to include a 404 page, so we do
app.use( pageNotFound );

// And it's also good practice to include a 500 page, so we do
app.use( serverError );

// And this is just some output to let us know that the server is up
app.listen(app.get('port'), function(){
  console.log('Express started on port: ' + app.get('port') + '; press Ctrl-C to axe it.');
});
