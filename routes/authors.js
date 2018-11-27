const mysql = require('../dbcon.js');

module.exports = {

	viewAuthors: ( req, res, next ) => {

		mysql.pool.query( 'SELECT id, fname, lname FROM authors', ( err, rows, fields ) => {

			if( err ){
				next(err);
				return;
			}

			let context = {};
			context.authors = rows;
			context.error = false;
			res.render( 'authors/authors', context );

		})

	},

	addAuthors: ( req, res, next ) => {

		mysql.pool.query( 'INSERT INTO authors ( `fname`, `lname` ) VALUES( ?, ? )', [ req.body.fname, req.body.lname ], ( err, result ) => {

			if( err ){
				next( err );
				return;
			}

			res.redirect(req.get('referer'));
		})

	},
	
	deleteAuthor: ( req, res, next ) => {

		mysql.pool.query( 'DELETE FROM authors WHERE `id` = ?', [ req.body.authorID ],  (err, result ) => {

				if( err ){
					let context = {};
					context.error = true;
					
					mysql.pool.query( 'SELECT b.title, a.id FROM authors a INNER JOIN authored_by ON authored_by.aid=a.id INNER JOIN books b on b.id=authored_by.bid WHERE a.id=?', req.body.authorID, ( err, result ) => {

						context.errorBookTitles = result;

						mysql.pool.query( 'SELECT id, fname, lname FROM authors', ( err, rows, fields ) => {

							if( err ){
								next(err);
								return;
							}

							context.authors = rows;
							console.log( context );
							res.render( 'authors/authors', context );

						})

					} )

				} else {

					res.redirect(req.get('referer'));

				}
		
		});

	},

	updateAuthor: ( req, res, next ) => {

		mysql.pool.query( 'UPDATE authors SET fname=?, lname=? WHERE id=?', 
			[ req.body.fname, req.body.lname, req.body.authorID ],  (err, result ) => {

				if( err ){
					next( err );
					return;
				}

				res.redirect(req.get('referer'));
		});

	}


}
