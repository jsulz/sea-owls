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
app.use( express.static( 'public' ) );

app.get('/',function(req,res,next){
    res.render('index' );
});

app.get( '/members', ( req, res, next ) => {

	mysql.pool.query( 'SELECT id, fname, lname, email, DATE_FORMAT(date_joined, "%m-%d-%Y") AS dateJoined FROM sea_owls', ( err, rows, fields ) => {

		if( err ){
			next(err);
			return;
		}

		let context = {};
		context.members = rows;
		res.render( 'members/members', context );

	})

});

app.get( '/member/:memberID', ( req, res, next ) => {
	
});

// don't worry about handling the server side stuff right now, just remember that we want a form here
// this is for handling adding members
app.post( '/members', ( req, res, next ) => {

});

app.get( '/books', ( req, res, next ) => {

	mysql.pool.query( 'SELECT id, fname, lname, email, DATE_FORMAT(date_published, "%m-%d-%Y") AS datePublished FROM sea_owls', ( err, rows, fields ) => {

		if( err ){
			next(err);
			return;
		}

		let context = {};
		context.books = rows;
		res.render( 'books/books', context );

	})

});

// don't worry about handling the server side stuff right now, just remember that we want a form here
// This is for handling adding books
app.post( '/books', ( req, res, next ) => {

});

app.get( '/book/:bookID', ( req, res, next ) => {

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