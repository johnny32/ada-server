/**
 * Created with JetBrains WebStorm.
 * User: Johnny
 * Date: 2/05/13
 * Time: 18:02
 * To change this template use File | Settings | File Templates.
 */
var mongo = require('mongodb');
require('./cocktail');

var Server = mongo.Server,
    Db = mongo.Db,
    BSON = mongo.BSONPure;

var server = new Server('localhost', 27017, {auto_reconnect: true});
db = new Db('sinatra', server);

exports.cocktail = function(req, res) {
  var id_cocktail = req.params.id_cocktail;
  findCktlById(id_cocktail, function(cktl) {
    res.render('frontend',
      {
        title: 'Cocktail',
        nombre: cktl.nombre,
        carbonico: cktl.carbonico,
        zumos: cktl.zumos,
        licores: cktl.licores,
        vaso: cktl.vaso,
        creador: cktl.creador,
        recomendado: cktl.recomendado
      }
    );
  }, console.log);
}
