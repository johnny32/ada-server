/**
 * Created with JetBrains WebStorm.
 * User: Johnny
 * Date: 11/04/13
 * Time: 17:51
 * To change this template use File | Settings | File Templates.
 */

var mongo = require('mongodb');

var Server = mongo.Server,
    Db = mongo.Db,
    BSON = mongo.BSONPure;

var server = new Server('localhost', 27017, {auto_reconnect: true});
db = new Db('sinatra', server);

db.open(function(err, db) {
  if (!err) {
    console.log("Connected to 'sinatra' database");
    db.collection('cocktails', {strict: true}, function(err, collection) {
      if (err) {
        console.log("The 'cocktails' collection doesn't exist. Creating it with sample data...");
        populateDB();
      }
    });
  }
});

/**
 * Llista tots els cocktails.
 *
 * @param req
 * @param res
 *
 * @author  jclara
 * @version 1.0
 * @date    2013-04-09
 */
exports.list = function(req, res) {
  db.collection('cocktails', function(err, collection) {
    collection.find().sort({rating: 1}).toArray(function(err, items) {
      res.send(items);
    });
  });
}

/**
 * Busca un cocktail pel seu id.
 *
 * @param req
 * @param res
 *
 * @author  jclara
 * @version 1.0
 * @date    2013-04-09
 */
exports.findById = function(req, res) {
  var id = req.params.id;
  console.log('Retrieving cocktail: ' + id);
  db.collection('cocktails', function(err, collection) {
    collection.findOne({'_id': new BSON.ObjectID(id)}, function(err, item) {
      if (!err) {
        res.send(item);
      } else {
        console.log("Error: cocktail " + id + " doesn't exist");
      }
    });
  });
}

/**
 * Crea un cocktail nou.
 *
 * @param req
 * @param res
 *
 * @author  jclara
 * @version 1.1
 * @date    2013-04-18
 */
exports.create = function(req, res) {
  var cktl = req.body;
  console.log('Receiving cocktail: ' + cktl.nombre);
  //Comprovem que els camps del cocktail siguin els correctes
  if (cktl.zumos && cktl.licores && cktl.carbonico && cktl.vaso && cktl.nombre && cktl.color && cktl.creador) {
    db.collection('cocktails', function(err, collection) {
      //Filtrem la resta de camps
      var cktl_ok =
      {
        zumos:      cktl.zumos,
        licores:    cktl.licores,
        carbonico:  cktl.carbonico,
        vaso:       cktl.vaso,
        nombre:     cktl.nombre,
        color:      cktl.color,
        creador:    cktl.creador
      };
      collection.insert(cktl_ok, function(err, item) {
        if (!err) {
          console.log("Cocktail inserted: " + cktl_ok.nombre);
        } else {
          console.log("Error: cocktail couldn't be inserted: " + cktl_ok.nombre);
        }
      });
    })
  } else {
    console.log("Error: cocktail not inserted (missing fields).");
    console.log(cktl);
  }
}

/**
 * Crea dades de prova per la base de dades.
 *
 * @author  jclara
 * @version 1.1
 * @date    2013-04-09
 */
var populateDB = function() {
  var cocktails = [
    {
      zumos:        ["Zumo de manzana", "Zumo de fresa"],
      licores:      ["Wishky"],
      carbonico:    "Lim&oacute;n",
      vaso:         "Chupito",
      nombre:       "El mejor",
      color:        "Verde",
      creador:      "Johnny"
    },
    {
      zumos:        ["Zumo de pi&ntilde;a"],
      licores:      ["Ron", "Ginebra"],
      carbonico:    "Cola",
      vaso:         "Cubata",
      nombre:       "Sex on the mountain",
      color:        "Amarillo",
      creador:      "Johnny"
    }
  ];

  db.collection('cocktails', function(err, collection) {
    collection.insert(cocktails, {safe:true}, function(err, result) {});
  })
}
