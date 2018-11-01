const mysql = require('../dbcon.js');

module.exports = {
	
	viewGenres: ( req, res, next ) => {

		mysql.pool.query( 'SELECT id, name FROM genres', ( err, rows, fields ) => {

			if( err ){
				next(err);
				return;
			}

			let context = {};
			context.genres = rows;
			res.render( 'genres/genres', context );

		});
	},

	addGenres: ( req, res, next ) => {

		mysql.pool.query( 'INSERT INTO genres ( `name` ) VALUES( ? )', req.body.name, ( err, result ) => {

			if( err ){
				next( err );
				return;
			}

			res.redirect(req.get('referer'));

		} )

	}

}