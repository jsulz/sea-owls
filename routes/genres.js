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

	},
	
	deleteGenre: ( req, res, next ) => {

		mysql.pool.query( 'DELETE FROM genres WHERE `id` = ?', [ req.body.genreID ],  (err, result ) => {

				if( err ){
					next( err );
					return;
				}

				res.redirect(req.get('referer'));
		});

	},

	updateGenre: ( req, res, next ) =>{

		mysql.pool.query( 'UPDATE genres SET name=? WHERE id=?', [ req.body.name, req.body.genreID ],  (err, result ) => {

				if( err ){
					next( err );
					return;
				}

				res.redirect(req.get('referer'));
		});

	}

}
