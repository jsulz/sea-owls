module.exports = {

	serverError: (err, req, res, next) => {
	  console.error(err.stack);
	  res.type('plain/text');
	  res.status(500);
	  res.render('500');
	},

	pageNotFound: ( req, res ) => {
		res.status( 404 );
		res.render( '404' );
	}

}