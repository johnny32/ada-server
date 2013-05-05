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
 * Retorna un cocktail com a objecte JSON pel seu id.
 *
 * @param req
 * @param res
 *
 * @author  jclara
 * @version 2.0
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
          res.send({
            id_cocktail: item._id
          });
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
 * Obte la URL de la imatge d'un cocktail segons el seu color i el seu got
 *
 * @param req
 * @param res
 *
 * @author  jclara
 * @version 2.0
 * @date    2013-04-27
 */
exports.image = function(req, res) {
  var vaso = req.params.vaso;
  var color = req.params.color;
  var img = "/images/chupitos/" + vaso + "_" + color + ".jpg";
  res.send({
    img: img
  });
}

/**
 * Obte la puntuacio mitja d'un cocktail
 *
 * @param req
 * @param res
 *
 * @author  jclara
 * @version 1.0
 * @date    2013-04-27
 */
exports.rating = function(req, res) {
  var id_cocktail = req.params.id_cocktail;
  console.log('Retrieving rating for cocktail: ' + id_cocktail);
  db.collection('cocktails', function(err, collection) {
    collection.findOne({'_id': new BSON.ObjectID(id_cocktail)}, function(err, item) {
      if (!err) {
        db.collection('ratings', function(err, collection) {
          collection.find({'id_cocktail': id_cocktail}).toArray(function(err, items) {
            var rating = 0;
            if (items.length > 0) {
              for (var i in items) {
                rating += items[i].rating;
              }
              rating = rating / items.length;
            }
            res.send({
              id_cocktail: id_cocktail,
              rating: rating
            });
          });
        });
      } else {
        console.log("Error: cocktail " + id_cocktail + " doesn't exist");
      }
    });
  });
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
      creador:      "51680bbaa4f196e415000001"
    },
    {
      zumos:        ["Zumo de pi&ntilde;a"],
      licores:      ["Ron", "Ginebra"],
      carbonico:    "Cola",
      vaso:         "Cubata",
      nombre:       "Sex on the mountain",
      color:        "Amarillo",
      creador:      "51680bbaa4f196e415000002"
    },
    {
      zumos:        ["Zumo de fresa", "Zumo de naranja", "Zumo de mango"],
      licores:      ["Ginebra", "Vodka", "Ron"],
      carbonico:    "Cola",
      vaso:         "Cubata",
      nombre:       "GLaDOS",
      color:        "Rojo",
      creador:      "51680bbaa4f196e415000002"
    },
    {
      zumos:        ["Naranja"],
      licores:      ["Vodka"],
      carbonico:    "Naranja",
      vaso:         "Chupito",
      nombre:       "Chupito de vodka con naranja",
      color:        "Naranja",
      creador:      "51680bbaa4f196e415000004"
    }
  ];

  db.collection('cocktails', function(err, collection) {
    collection.insert(cocktails, {safe:true}, function(err, result) {});
  });
}
