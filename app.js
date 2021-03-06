
/**
 * Module dependencies.
 */

var express = require('express')
  , routes = require('./routes')
  , user = require('./routes/user')
  , admin = require('./routes/admin')
  , cocktail = require('./routes/cocktail')
  , web = require('./routes/web')
  , ingredients = require('./routes/ingredients')
  , maps = require('./routes/maps')
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
app.use(express.cookieParser());
app.use(express.session({ secret: "test" }));
app.use(app.router);
app.use(express.static(path.join(__dirname, 'public')));
app.options('*', function(req, res) {
  res.header("Access-Control-Allow-Origin", "*");
});

// development only
if ('development' == app.get('env')) {
  app.use(express.errorHandler());
}

app.get('/', routes.index);
app.get('/users', user.list);
app.get('/users/:id', user.findById);
app.get('/users/facebook/:id_facebook', user.findByFacebook);
app.get('/users/twitter/:id_twitter', user.findByTwitter);
app.get('/cocktails', cocktail.list);
app.get('/cocktails/q/:limit', cocktail.listLimit);
app.get('/cocktails/recommended', admin.recommendedCocktail);
app.get('/cocktails/:id', cocktail.findById);
app.get('/cocktails/user/:id_usuario', cocktail.findByUser);
app.post('/cocktails', cocktail.create);
app.post('/image', cocktail.image);
app.get('/ratings/:id_cocktail', cocktail.rating);
app.get('/ingredients', ingredients.list);
app.get('/ingredients/tipo/:tipo', ingredients.listByType);
app.get('/ingredients/:id', ingredients.findById);
app.post('/ratings', cocktail.rate);
app.get('/ratings/:id_cocktail/:id_user', cocktail.userRate);
app.get('/maps', maps.list);

//Backend
app.get('/admin', checkLogged, admin.index);
app.get('/login', admin.loginPage);
app.post('/login', admin.loginAction);
app.get('/cocktails_admin', checkLogged, admin.cocktails);
app.post('/cocktails_admin', checkLogged, admin.createCocktail);
app.get('/cocktails_admin/:id_cocktail', admin.findCktlById);
app.post('/admin/recommend', checkLogged, admin.recommendCocktail);
app.post('/ingredients', checkLogged, ingredients.create);
app.post('/maps', checkLogged, maps.create);
app.delete('/maps/:latitud/:longitud', checkLogged, maps.delete);

//Web (frontend)
app.get('/:id_cocktail', web.cocktail);
app.post('/web/ratings', web.rate);

http.createServer(app).listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});

function checkLogged(req,res,next){
  if (req.session.logged) {
    next();
  } else {
    res.redirect('/login');
  }
}