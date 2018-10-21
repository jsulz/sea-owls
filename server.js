// Setting up our middleware for Express, Handlebars, and Body Parser as well as our connection to the MySQL DB
// Express
let express = require('express');
let app = express();
// MySQL connection
var mysql = require('./dbcon.js');
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

app.get('/',function(req,res,next){
    res.render('index' );
});

app.get( '/members', ( req, res, next ) => {

	mysql.pool.query( 'SELECT id, fname, lname FROM sea_owls', ( err, rows, fields ) => {

		if( err ){
			next(err);
			return;
		}

		let context = {};
		context.members = rows;
		res.render( 'members/members', context );

	})

});

// Show the user's books being read/have already read
app.get( '/member/:memberID', ( req, res, next ) => {

	mysql.pool.query( 'SELECT id, fname, lname, email, DATE_FORMAT(date_joined, "%m-%d-%Y") AS dateJoined FROM sea_owls WHERE id=?', req.params.memberID, ( err, rows, fields ) => {

		if( err ){
			next(err);
			return;
		}

		let context = {};
		context.member = rows;

		mysql.pool.query( 'SELECT SO.id, B.title, RL.finished FROM sea_owls SO INNER JOIN reading_list RL ON RL.mid = SO.id INNER JOIN books B ON B.id = RL.bid WHERE SO.id=?', req.params.memberID, (err, rows, fields ) => {

			context.readingList = rows;

			mysql.pool.query( 'SELECT id, title FROM books', ( err, rows, fields ) => {


				context.books = rows; 

				res.render( 'members/member', context );

			});

		});	

	});
	
});

// don't worry about handling the server side stuff right now, just remember that we want a form here
// this is for handling adding members
// INSERT
app.post( '/members', ( req, res, next ) => {

});

app.get( '/books', ( req, res, next ) => {

	mysql.pool.query( 'SELECT id, title, genre, isbn, date_published FROM books', ( err, rows, fields ) => {

		if( err ){
			next(err);
			return;
		}

		let context = {};
		context.books = rows;

		mysql.pool.query( 'SELECT id, name FROM genres', (err, rows, fields ) => {

			context.genres = rows;

			mysql.pool.query( 'SELECT id, fname, lname FROM authors', (err, rows, fields ) => {

				context.authors = rows;
				res.render( 'books/books', context );

			})
		});

	})

});

app.get( '/book/:bookID', ( req, res, next ) => {

	mysql.pool.query('SELECT B.id, B.title, B.isbn, B.date_published, A.fname, A.lname, G.name FROM books B INNER JOIN authored_by AB ON AB.bid = B.id INNER JOIN authors A ON A.id = AB.aid INNER JOIN genres G ON G.id = B.genre WHERE B.id =?', req.params.bookID, ( err, rows, fields) => {

		if( err ){
			next(err);
			return;
		}

		let context = {};
		context.book = rows;
		res.render( 'books/book', context );

	});
});

// don't worry about handling the server side stuff right now, just remember that we want a form here
// This is for handling adding books
// INSERT
app.post( '/books', ( req, res, next ) => {

});

// It's good practice to include a 404 page, so we do
app.use( ( req, res ) => {
	res.status( 404 );
	res.render( '404' );
});

// And it's also good practice to include a 500 page, so we do
app.use(function(err, req, res, next){
  console.error(err.stack);
  res.type('plain/text');
  res.status(500);
  res.render('500');
});

// And this is just some output to let us know that the server is up
app.listen(app.get('port'), function(){
  console.log('Express started on port: ' + app.get('port') + '; press Ctrl-C to axe it.');
});