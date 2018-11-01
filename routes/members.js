const mysql = require( '../dbcon.js' );

module.exports = {

	viewMembers: ( req, res, next ) => {

		mysql.pool.query( 'SELECT id, fname, lname FROM sea_owls', ( err, rows, fields ) => {

			if( err ){
				next(err);
				return;
			}

			let context = {};
			context.members = rows;
			res.render( 'members/members', context );

		});

	},

	viewMember: ( req, res, next ) => {

		mysql.pool.query( 'SELECT id, fname, lname, email, DATE_FORMAT(date_joined, "%m-%d-%Y") AS dateJoined FROM sea_owls WHERE id=?', req.params.memberID, ( err, rows, fields ) => {

			if( err ){
				next(err);
				return;
			}

			let context = {};
			context.member = rows;

			mysql.pool.query( 'SELECT SO.id, B.title, RL.finished, RL.bid, RL.mid FROM sea_owls SO INNER JOIN reading_list RL ON RL.mid = SO.id INNER JOIN books B ON B.id = RL.bid WHERE SO.id=?', 
				req.params.memberID, (err, rows, fields ) => {

				context.readingList = rows;

				mysql.pool.query( 'SELECT id, title FROM books', ( err, rows, fields ) => {


					context.books = rows; 

					res.render( 'members/member', context );

				});

			});	

		});
		
	},

	addMember: ( req, res, next ) => {

		mysql.pool.query( 'INSERT INTO sea_owls (`fname`, `lname`, `email`, `date_joined`) VALUES ( ?, ?, ?, ? )', 
			[ req.body.fname, req.body.lname, req.body.email, req.body.date_joined ],  (err, result ) => {

				if( err ){
					next( err );
					return;
				}

				res.redirect(req.get('referer'));
		});

	}, 

	addToReadingList: ( req, res, next ) => {

		mysql.pool.query( 'INSERT INTO reading_list ( `mid`, `bid` ) VALUES ( ?, ? )', [ req.params.memberID, req.body.bid ], ( err, result ) => {

				if( err ){
					next( err );
					return;
				}

				res.redirect(req.get('referer'));

		});

	}


}