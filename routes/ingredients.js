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

var fs = require('fs');

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
 * Crea un nou ingredient
 *
 * @param req
 * @param res
 *
 * @author  jclara
 * @version 1.0
 * @date    2013-05-12
 */
exports.create = function(req, res) {
  if (req.body.descripcion && req.body.tipo && req.files.imagen) {
    mongo.Db.connect(mongoUri, function (err, db) {
      db.collection('ingredients', function(err, collection) {
        fs.readFile(req.files.imagen.path, function(err, data) {
          if (req.files.imagen.type.indexOf("image/") != -1) {
            var ruta_parcial = req.body.tipo + "_" + req.body.descripcion;
            ruta_parcial = "/../public/images/ingredients/" + ruta_parcial.replace(/ /g, "_");
            var parts = req.files.imagen.name.split(".");
            if (parts.length > 1) {
              var ext = parts[parts.length-1];
              var ruta = __dirname + ruta_parcial + "." + ext;
              fs.writeFile(ruta, data, function(err) {
                if (!err) {
                  var ing_ok = {
                    descripcion: req.body.descripcion,
                    tipo: req.body.tipo,
                    imagen: ruta
                  };
                  collection.insert(ing_ok, function(err, item) {
                    if (!err) {
                      console.log("Ingredient inserted");
                      res.render('backend', {
                        title: 'Zona de administraci&oacute;n',
                        error_cktl: '',
                        msg_cktl: '',
                        error_ingredient: '',
                        msg_ingredient: 'Ingrediente creado correctamente'
                      });
                    } else {
                      console.log("Error: admin cocktail couldn't be inserted: " + cktl_ok.nombre);
                      console.log(err);
                      res.render('backend',
                        {
                          title: 'Zona de administraci&oacute;n',
                          error_cktl: '',
                          msg_cktl: '',
                          error_ingredient: 'Hubo un error insertando el ingrediente.',
                          msg_ingredient: ''
                        }
                      );
                    }
                  });
                } else {
                  console.log("Error: file couldn't be uploaded.");
                  console.log(err);
                  res.render('backend', {
                    title: 'Zona de administraci&oacute;n',
                    error_cktl: '',
                    msg_cktl: '',
                    error_ingredient: 'Hubo un error subiendo la imagen al servidor.',
                    msg_ingredient: ''
                  });
                }
              });
            } else {
              console.log("Error: file has no extension");
              console.log(err);
              res.render('backend', {
                title: 'Zona de administraci&oacute;n',
                error_cktl: '',
                msg_cktl: '',
                error_ingredient: 'La imagen no tiene extensi&oacute;n.',
                msg_ingredient: ''
              });
            }
          } else {
            console.log("Error: file isn't an image.");
            console.log(err);
            res.render('backend', {
              title: 'Zona de administraci&oacute;n',
              error_cktl: '',
              msg_cktl: '',
              error_ingredient: 'El archivo seleccionado debe ser una imagen.',
              msg_ingredient: ''
            });
          }
        });
      });
    });
  } else {
    console.log("Error: ingredient not inserted (missing fields).")
    console.log("Description: " + req.body.descripcion);
    console.log("Type: " + req.body.tipo);
    console.log("Image: " + req.files.imagen);
    res.render('backend', {
      title: 'Zona de administraci&oacute;n',
      error_cktl: '',
      msg_cktl: '',
      error_ingredient: 'Faltan campos en la creaci&oacute;n del ingrediente.',
      msg_ingredient: ''
    });
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