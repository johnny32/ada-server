/**
 * Created with JetBrains WebStorm.
 * User: Johnny
 * Date: 2/05/13
 * Time: 18:02
 * To change this template use File | Settings | File Templates.
 */
var mongo = require('mongodb');
require('./cocktail');
require('./user');

var Server = mongo.Server,
    Db = mongo.Db,
    BSON = mongo.BSONPure;

var server = new Server('localhost', 27017, {auto_reconnect: true});
db = new Db('sinatra', server);

exports.cocktail = function(req, res) {
  var id_cocktail = req.params.id_cocktail;
  res.render('frontend',
    {
      title: 'Cocktail',
      id_cocktail: id_cocktail
    }
  );
}
