const mysql = require( '../dbcon.js' );

module.exports = {

	viewBooks: ( req, res, next ) => {

		mysql.pool.query( 'SELECT id, title, genre, isbn, date_published FROM books', ( err, rows, fields ) => {

			if( err ){
				next(err);
				return;
			}

			let context = {};
			context.noSearch = true;
			context.books = rows;

			mysql.pool.query( 'SELECT id, name FROM genres', (err, rows, fields ) => {

				context.genres = rows;

				mysql.pool.query( 'SELECT id, fname, lname FROM authors', (err, rows, fields ) => {

					context.authors = rows;
					res.render( 'books/books', context );

				});
			});

		});

	},

	searchBooks: ( req, res, next ) => {

		mysql.pool.query( 'SELECT id, title, genre, isbn, date_published FROM books WHERE title LIKE ?', '%' + req.query.s + '%', ( err, rows, fields ) => {

			if( err ){
				next(err);
				return;
			}

			let context = {};
			context.noSearch = false;
			context.query = req.query.s;
			context.books = rows;

			mysql.pool.query( 'SELECT id, name FROM genres', (err, rows, fields ) => {

				context.genres = rows;

				mysql.pool.query( 'SELECT id, fname, lname FROM authors', (err, rows, fields ) => {

					context.authors = rows;
					res.render( 'books/books', context );

				});
			});

		});

	},

	viewBook: ( req, res, next ) => {

		mysql.pool.query('SELECT title, isbn, date_published FROM books WHERE id=?', req.params.bookID, ( err, rows, fields) => {

			if( err ){
				next(err);
				return;
			}

			let context = {};
			context.book = rows;

			mysql.pool.query( 'SELECT aid FROM authored_by WHERE bid=?', req.params.bookID, ( err, rows, fields ) => {
				if( err ){
					next(err);
					return;
				}

				context.aid = rows;

				if( context.aid.length > 0 ){

					mysql.pool.query( 'SELECT fname, lname FROM authors WHERE id=?', context.aid[0].aid, ( err, rows, fields ) => {

						context.book[0].fname = rows[0].fname;
						context.book[0].lname = rows[0].lname;

						res.render( 'books/book', context );

					});

				} else {
					
					context.book[0].fname = "No Author";
					res.render( 'books/book', context );

				}
			});

		});
	},

	addBooks: ( req, res, next ) => {

		mysql.pool.query( 'INSERT INTO books ( `title`, `genre`, `date_published`, `isbn` ) VALUES ( ?, ?, ?, ? )', [ req.body.title, req.body.genre, req.body.date_published, req.body.isbn ], ( err, result ) => {

			if( err ){
				next( err );
				return;
			}

			mysql.pool.query( 'INSERT INTO authored_by ( `bid`, `aid` ) VALUES ( ?, ? )', [ result.insertId, req.body.author ], ( err, result ) => {

				if( err ){
					next( err );
					return;
				}

				res.redirect(req.get('referer'));

			});

		});

	},
	
	deleteBook: ( req, res, next ) => {

		mysql.pool.query( 'DELETE FROM books WHERE `id` = ?', [ req.body.bookID ],  (err, result ) => {

				if( err ){
					next( err );
					return;
				}

				res.redirect(req.get('referer'));
		});

	}


}
