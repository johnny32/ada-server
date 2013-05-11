/**
 * Created with JetBrains WebStorm.
 * User: Johnny
 * Date: 5/05/13
 * Time: 18:56
 * To change this template use File | Settings | File Templates.
 */
var mongo = require('mongodb');

var mongoUri = process.env.MONGOLAB_URI ||
    process.env.MONGOHQ_URL ||
    'mongodb://localhost/sinatra';

var BSON = mongo.BSONPure;

/**
 * Llista tots els ingredients.
 *
 * @param req
 * @param res
 *
 * @author  jclara
 * @version 1.0
 * @date    2013-05-05
 */
exports.list = function(req, res) {
  mongo.Db.connect(mongoUri, function (err, db) {
    db.collection('ingredients', function(err, collection) {
      collection.find().sort({descripcion: 1}).toArray(function(err, items) {
        res.send(items);
      });
    });
  });
}

/**
 * Llista els ingredients d'un tipus concret
 *
 * @param req
 * @param res
 *
 * @author  jclara
 * @version 1.0
 * @date    2013-05-05
 */
exports.listByType = function(req, res) {
  var tipo = req.params.tipo;
  console.log('Retrieving ingredients of type: ' + tipo);
  mongo.Db.connect(mongoUri, function (err, db) {
    db.collection('ingredients', function(err, collection) {
      collection.find({tipo: tipo}).sort({descripcion: 1}).toArray(function(err, items) {
        res.send(items);
      });
    });
  });
}

/**
 * Retorna un ingredient com a objecte JSON pel seu id.
 *
 * @param req
 * @param res
 *
 * @author  jclara
 * @version 1.0
 * @date    2013-05-05
 */
exports.findById = function(req, res) {
  var id = req.params.id;
  console.log('Retrieving ingredient: ' + id);
  mongo.Db.connect(mongoUri, function (err, db) {
    db.collection('ingredients', function(err, collection) {
      collection.findOne({'_id': new BSON.ObjectID(id)}, function(err, item) {
        if (!err) {
          res.send(item);
        } else {
          console.log("Error: ingredient " + id + " doesn't exist");
        }
      });
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
  var ingredients = [
    {
      descripcion:  "Zumo de naranja",
      tipo:         "Zumo"
    },
    {
      descripcion:  "Zumo de fresa",
      tipo:         "Zumo"
    },
    {
      descripcion:  "Zumo de mango",
      tipo:         "Zumo"
    },
    {
      descripcion:  "Zumo de piña",
      tipo:         "Zumo"
    },
    {
      descripcion:  "Zumo de melocotón",
      tipo:         "Zumo"
    },
    {
      descripcion:  "Zumo de limón",
      tipo:         "Zumo"
    },
    {
      descripcion:  "Ron",
      tipo:         "Licor"
    },
    {
      descripcion:  "Whisky",
      tipo:         "Licor"
    },
    {
      descripcion:  "Vodka",
      tipo:         "Licor"
    },
    {
      descripcion:  "Ginebra",
      tipo:         "Licor"
    },
    {
      descripcion:  "Tequila",
      tipo:         "Licor"
    },
    {
      descripcion:  "Absenta",
      tipo:         "Licor"
    },
    {
      descripcion:  "Cola",
      tipo:         "Carbonico"
    },
    {
      descripcion:  "Limón",
      tipo:         "Carbonico"
    },
    {
      descripcion:  "Naranja",
      tipo:         "Carbonico"
    },
    {
      descripcion:  "Tónica",
      tipo:         "Carbonico"
    },
    {
      descripcion:  "Cubata",
      tipo:         "Vaso"
    },
    {
      descripcion:  "Chupito",
      tipo:         "Vaso"
    },
    {
      descripcion:  "Pinta",
      tipo:         "Vaso"
    },
    {
      descripcion:  "Copa de champán",
      tipo:         "Vaso"
    },
    {
      descripcion:  "Blanco",
      tipo:         "Color"
    },
    {
      descripcion:  "Azul",
      tipo:         "Color"
    },
    {
      descripcion:  "Naranja",
      tipo:         "Color"
    },
    {
      descripcion:  "Amarillo",
      tipo:         "Color"
    },
    {
      descripcion:  "Rojo",
      tipo:         "Color"
    },
    {
      descripcion:  "Verde",
      tipo:         "Color"
    },
    {
      descripcion:  "Negro",
      tipo:         "Color"
    }
  ];

  db.collection('ingredients', function(err, collection) {
    collection.insert(ingredients, {safe:true}, function(err, result) {});
  });
}