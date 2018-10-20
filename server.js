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
  var context = {};
  var createString = "CREATE TABLE diagnostic(" +
  "id INT PRIMARY KEY AUTO_INCREMENT," +
  "text VARCHAR(255) NOT NULL)";
  mysql.pool.query('DROP TABLE IF EXISTS diagnostic', function(err){
    if(err){
      next(err);
      return;
    }
    mysql.pool.query(createString, function(err){
      if(err){
	next(err);
                return;
      }
          mysql.pool.query('INSERT INTO diagnostic (`text`) VALUES ("MySQL is Working!")',function(err){
            mysql.pool.query('SELECT * FROM diagnostic', function(err, rows, fields){
                  context.results = JSON.stringify(rows);
                  res.render('index',context);
                });
          });
    });
  });
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