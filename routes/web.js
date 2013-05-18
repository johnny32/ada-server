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

/**
 * Puntua un cocktail (des de la pagina web)
 *
 * @author  jclara
 * @version 1.0
 * @date    2013-05-11
 */
exports.rate = function(req, res) {
  var id_cocktail = req.body.id_cocktail;
  var id_user = req.body.id_user;
  var rating = req.body.rating;
  console.log("User " + id_user + " has rated cocktail " + id_cocktail + " with rate " + rating);
  mongo.Db.connect(mongoUri, function (err, db) {
    db.collection('ratings', function(err, collection) {
      var row = {
        id_cocktail: id_cocktail,
        id_user: id_user,
        rating: rating
      };
      collection.insert(row, function(err, item) {
        if (!err) {
          console.log("Rating inserted");
          collection.find({'id_cocktail': id_cocktail}).toArray(function(err, items) {
            var rating = 0;
            if (items.length > 0) {
              for (var i in items) {
                rating += parseInt(items[i].rating);
              }
              rating = rating / items.length;
            }
            db.collection('cocktails', function(err, collection) {
              collection.update({'_id': new BSON.ObjectID(id_cocktail)}, {$set: {rating: rating}}, function(err, cktl) {
                if (!err) {
                  console.log("Ratings for cocktail " + id_cocktail + ": " + rating);
                  res.render('frontend', {
                    title: 'Cocktail',
                    id_cocktail: id_cocktail,
                    error: '',
                    msg: 'Cocktail puntuado correctamente.'
                  });
                } else {
                  console.log("Ratings cocktail update failed.");
                }
              });
            });
          });
        } else {
          console.log("Error: rating couldn't be inserted");
          res.render('frontend', {
            title: 'Cocktail',
            id_cocktail: id_cocktail,
            error: 'Ha habido un error puntuando el cocktail.',
            msg: ''
          });
        }
      });
    });
  });
}
