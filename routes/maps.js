/**
 * Created with JetBrains WebStorm.
 * User: Johnny
 * Date: 16/05/13
 * Time: 8:02
 * To change this template use File | Settings | File Templates.
 */
var mongo = require('mongodb');

var mongoUri = process.env.MONGOLAB_URI ||
  process.env.MONGOHQ_URL ||
  'mongodb://localhost/sinatra';

var BSON = mongo.BSONPure;

/**
 * Llista tots els punts de mapa.
 *
 * @param req
 * @param res
 *
 * @author  jclara
 * @version 1.0
 * @date    2013-05-16
 */
exports.list = function(req, res) {
  mongo.Db.connect(mongoUri, function (err, db) {
    db.collection('maps', function(err, collection) {
      collection.find().toArray(function(err, items) {
        res.send(items);
      });
    });
  });
}

/**
 * Crea un punt de mapa nou.
 *
 * @param req
 * @param res
 *
 * @author  jclara

 * @version 1.1
 * @date    2013-05-16
 */
exports.create = function(req, res) {
  var map = req.body;
  console.log('Receiving map point: ' + map.latitud + ', ' + map.longitud);
  //Comprovem que els camps del punt de mapa siguin els correctes
  if (map.latitud && map.longitud && map.titulo && map.descripcion) {
    mongo.Db.connect(mongoUri, function (err, db) {
      db.collection('maps', function(err, collection) {
        //Filtrem la resta de camps
        var map_ok =
        {
          latitud:      map.latitud,
          longitud:     map.longitud,
          titulo:       map.titulo,
          descripcion:  map.descripcion
        };
        collection.insert(map_ok, function(err, item) {
          if (!err) {
            console.log('Map point inserted: ' + map_ok.latitud + ', ' + map_ok.longitud);
            res.send({});
          } else {
            console.log("Error: map point couldn't be inserted: " + map_ok.latitud + ', ' + map_ok.longitud);
          }
        });
      });
    });
  } else {
    console.log("Error: map point not inserted (missing fields).");
    console.log(map);
  }
}

/**
 * Elimina un punt de mapa per la seva latitud i longitud
 *
 * @param req
 * @param res
 *
 * @author  jclara
 * @version 1.0
 * @date    2013-05-16
 */
exports.delete = function(req, res) {
  var latitud = req.params.latitud;
  var longitud = req.params.longitud;
  console.log('Deleting map point: ' + latitud + ', ' + longitud);
  mongo.Db.connect(mongoUri, function(err, db) {
    db.collection('maps', function(err, collection) {
      collection.findOne({"latitud": latitud, "longitud": longitud}, function(err, item) {
        if (!err && item.latitud !== undefined) {
          collection.remove({"latitud": latitud, "longitud": longitud}, function(err) {
            if (err) {
              console.log("Error deleting map point: " + latitud + ", " + longitud);
            } else {
              res.send({});
            }
          });
        } else {
          console.log("Error: map point not found: " + latitud + ", " + longitud);
        }
      });
    });
  });
}