/**
 * Created with JetBrains WebStorm.
 * User: Johnny
 * Date: 11/04/13
 * Time: 17:51
 * To change this template use File | Settings | File Templates.
 */
var mongo = require('mongodb');

var mongoUri = process.env.MONGOLAB_URI ||
    process.env.MONGOHQ_URL ||
    'mongodb://localhost/sinatra';

var BSON = mongo.BSONPure;

var path = require('path');

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
  mongo.Db.connect(mongoUri, function (err, db) {
    db.collection('cocktails', function(err, collection) {
      collection.find().sort({rating: 1}).toArray(function(err, items) {
        res.send(items);
      });
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
  mongo.Db.connect(mongoUri, function (err, db) {
    db.collection('cocktails', function(err, collection) {
      collection.findOne({'_id': new BSON.ObjectID(id)}, function(err, cktl) {
        if (!err) {
          res.send(cktl);
        } else {
          console.log("Error: cocktail " + id + " doesn't exist");
        }
      });
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
  if (cktl.zumos && cktl.carbonico && cktl.vaso && cktl.nombre && cktl.creador && cktl.imagen) {
    mongo.Db.connect(mongoUri, function (err, db) {
      db.collection('cocktails', function(err, collection) {
        //Filtrem la resta de camps
        var licores = [];
        if (cktl.licores) {
          var licores = cktl.licores;
        }
        var cktl_ok =
        {
          zumos:      cktl.zumos,
          licores:    licores,
          carbonico:  cktl.carbonico,
          vaso:       cktl.vaso,
          nombre:     cktl.nombre,
          creador:    cktl.creador,
          imagen:     cktl.imagen
        };
        collection.insert(cktl_ok, function(err, item) {
          if (!err) {

            console.log("Cocktail inserted: " + cktl_ok.nombre + " - " + item[0]._id);
            res.send({
              id: item[0]._id,
              url: path + '/' + item[0]._id
            });
          } else {
            console.log("Error: cocktail couldn't be inserted: " + cktl_ok.nombre);
          }
        });
      });
    });
  } else {
    console.log("Error: cocktail not inserted (missing fields).");
    console.log(cktl);
  }
}

/**
 * Obte la URL de la imatge d'un cocktail segons els seus ingredients
 *
 * @param req
 * @param res
 *
 * @author  jclara
 * @version 3.0
 * @date    2013-04-27
 */
exports.image = function(req, res) {
  var vaso = req.body.vaso;
  var zumos = req.body.zumos;
  var color = getColor(zumos);
  var img = ("/images/cocktails/" + vaso + "_" + color + ".jpg").replace(/ /g, "_");
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
  mongo.Db.connect(mongoUri, function (err, db) {
    db.collection('cocktails', function(err, collection) {
      collection.findOne({'_id': new BSON.ObjectID(id_cocktail)}, function(err, item) {
        if (!err) {
          db.collection('ratings', function(err, collection) {
            collection.find({'id_cocktail': id_cocktail}).toArray(function(err, items) {
              var rating = 0;
              if (items.length > 0) {
                for (var i in items) {
                  rating += parseInt(items[i].rating);
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
  });
}

/**
 * Puntua un cocktail
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
          res.render('frontend', {
            title: 'Cocktail',
            id_cocktail: id_cocktail,
            error: '',
            msg: 'Cocktail puntuado correctamente.'
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

/**
 * Retorna la puntuacio que ha donat un usuari a un cocktail, o -1 si no ha votat
 *
 * @param req
 * @param res
 *
 * @author  jclara
 * @version 1.0
 * @date    2013-05-11
 */
exports.userRate = function(req, res) {
  var id_cocktail = req.params.id_cocktail;
  var id_user = req.params.id_user;
  mongo.Db.connect(mongoUri, function (err, db) {
    db.collection('ratings', function(err, collection) {
      collection.findOne({$and: [{id_cocktail: id_cocktail}, {id_user: id_user}]}, function(err, rating) {
        if (rating) {
          res.send({
            rating: rating.rating
          })
        } else {
          rating: -1
        }
      })
    });
  });
}

/**
 * Llista els cocktails d'un usuari
 *
 * @param req
 * @param res
 *
 * @author  jclara
 * @version 1.0
 * @date    2013-05-16
 */
exports.findByUser = function(req, res) {
  var id_usuario = req.params.id_usuario;
  console.log("Retrieving cocktails of user: " + id_usuario);
  mongo.Db.connect(mongoUri, function(err, db) {
    db.collection('cocktails', function(err, collection) {
      collection.find({creador: id_usuario}).toArray(function(err, items) {
        res.send(items);
      })
    })
  });
}

/**
 * Calcula el color a partir dels sucs
 *
 * @param zumos
 * @returns {*}
 *
 * @author  jclara
 * @version 1.0
 * @date    2013-05-12
 */
function getColor(zumos) {
  var totales = [];
  for (var i in zumos) {
    if (zumos[i] == "Fresa" || zumos[i] == "Sandía" || zumos[i] == "Pomelo") {
      totales[i] = "Rojo";
    } else if (zumos[i] == "Naranja" || zumos[i] == "Melocotón" || zumos[i] == "Mango" || zumos[i] == "Fruta de la pasión") {
      totales[i] = "Naranja";
    } else if (zumos[i] == "Melón") {
      totales[i] = "Verde";
    } else {
      totales[i] = "Amarillo";
    }
  }
  var color = totales[Math.floor(Math.random()*totales.length)];
  return color;
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
      creador:      "johnny32"
    },
    {
      zumos:        ["Zumo de pi&ntilde;a"],
      licores:      ["Ron", "Ginebra"],
      carbonico:    "Cola",
      vaso:         "Cubata",
      nombre:       "Sex on the mountain",
      color:        "Amarillo",
      creador:      "JosepManrique"
    },
    {
      zumos:        ["Zumo de fresa", "Zumo de naranja", "Zumo de mango"],
      licores:      ["Ginebra", "Vodka", "Ron"],
      carbonico:    "Cola",
      vaso:         "Cubata",
      nombre:       "GLaDOS",
      color:        "Rojo",
      creador:      "johnny32"
    },
    {
      zumos:        ["Naranja"],
      licores:      ["Vodka"],
      carbonico:    "Naranja",
      vaso:         "Chupito",
      nombre:       "Chupito de vodka con naranja",
      color:        "Naranja",
      creador:      "PaulMcCartney"
    }
  ];

  db.collection('cocktails', function(err, collection) {
    collection.insert(cocktails, {safe:true}, function(err, result) {});
  });
}
