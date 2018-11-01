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

	}


}