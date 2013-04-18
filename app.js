
/**
 * Module dependencies.
 */

var express = require('express')
  , routes = require('./routes')
  , user = require('./routes/user')
  , cocktail = require('./routes/cocktail')
  , http = require('http')
  , path = require('path');

var app = express();

// all environments
app.set('port', process.env.PORT || 3000);
app.set('views', __dirname + '/views');
app.set('view engine', 'jade');
app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.bodyParser());
app.use(express.methodOverride());
app.use(app.router);
app.use(express.static(path.join(__dirname, 'public')));

// development only
if ('development' == app.get('env')) {
  app.use(express.errorHandler());
}

app.get('/', routes.index);
app.get('/users', user.list); //TODO Eliminar
app.get('/users/:id', user.findById);
app.get('/users/facebook/:id_facebook', user.findByFacebook);
app.get('/users/twitter/:id_twitter', user.findByTwitter);
app.get('/users/friends/:id', user.friends);
app.get('/cocktails', cocktail.list);
app.get('/cocktails/:id', cocktail.findById);
app.post('/cocktails', cocktail.post);

http.createServer(app).listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});
