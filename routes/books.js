const mysql = require( '../dbcon.js' );

module.exports = {

	viewBooks: ( req, res, next ) => {

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

	},

	viewBook: ( req, res, next ) => {

		mysql.pool.query('SELECT B.id, B.title, B.isbn, B.date_published, A.fname, A.lname, G.name FROM books B INNER JOIN authored_by AB ON AB.bid = B.id INNER JOIN authors A ON A.id = AB.aid INNER JOIN genres G ON G.id = B.genre WHERE B.id =?', req.params.bookID, ( err, rows, fields) => {

			if( err ){
				next(err);
				return;
			}

			let context = {};
			context.book = rows;
			res.render( 'books/book', context );

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

			})

		})

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
