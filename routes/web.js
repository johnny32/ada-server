/**
 * Created with JetBrains WebStorm.
 * User: Johnny
 * Date: 2/05/13
 * Time: 18:02
 * To change this template use File | Settings | File Templates.
 */
var mongo = require('mongodb');

var mongoUri = process.env.MONGOLAB_URI ||
    process.env.MONGOHQ_URL ||
    'mongodb://localhost/sinatra';

var BSON = mongo.BSONPure;

exports.cocktail = function(req, res) {
  var id_cocktail = req.params.id_cocktail;
  res.render('frontend',
    {
      title: 'Cocktail',
      id_cocktail: id_cocktail,
      error: '',
      msg: ''
    }
  );
}
