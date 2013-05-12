/**
 * Created with JetBrains WebStorm.
 * User: Johnny
 * Date: 28/04/13
 * Time: 12:52
 * To change this template use File | Settings | File Templates.
 */
var mongo = require('mongodb');

var mongoUri = process.env.MONGOLAB_URI || 
  process.env.MONGOHQ_URL || 
  'mongodb://localhost/sinatra';

var BSON = mongo.BSONPure;

/**
 * Accedeix a la part de backend (si l'admin ha iniciat sessio) o renderitza la pagina de login
 *
 * @param req
 * @param res
 *
 * @author  jclara
 * @version 1.0
 * @date    2013-04-28
 */
exports.index = function(req, res) {
  res.render('backend',
    {
      title: 'Zona de administraci&oacute;n',
      error_cktl: '',
      msg_cktl: '',
      error_ingredient: '',
      msg_ingredient: ''
    });
}

/**
 * Mostra la pagina de login
 *
 * @param req
 * @param res
 *
 * @author  jclara
 * @version 1.0
 * @date    2013-04-28
 */
exports.loginPage = function(req, res) {
  populateDB();
  if (req.session.logged) {
    res.redirect('/admin');
  }
  res.clearCookie('user');
  res.clearCookie('pass');
  res.render('login',
    {
      title: 'Login',
      error: ''
    }
  );
}

/**
 * Comprova l'usuari i contrassenya i, si son valids, ho guarda a les cookies.
 *
 * @param req
 * @param res
 *
 * @author  jclara
 * @version 1.1
 * @date    2013-04-28
 */
exports.loginAction = function(req, res) {
  var user = req.body.user;
  var pass = req.body.passenc;
  console.log('Retrieving admin user: ' + user);
  console.log('Encrypted password: ' + pass);
  mongo.Db.connect(mongoUri, function (err, db) {
    db.collection('reg_users', function(er, collection) {
      collection.findOne({'user': user, 'pass': pass}, function(err, item) {
        if (!err && item != null) {
          console.log("Correct admin user: " + req.body.user);
          req.session.logged = true;
          res.redirect('/admin');
        } else {
          fail();
        }
      });
    });
  });

  function fail() {
    console.log("Incorrect admin user/password: " + req.body.user);
    res.render('login', {
      title: 'Login',
      error: 'Usuario o contrase&ntilde;a incorrecto(s).'
    })
  }
}

/**
 * Marca un cocktail com a recomanat (i desmarca la resta).
 *
 * @param req
 * @param res
 *
 * @author  jclara
 * @version 1.0
 * @date    2013-05-01
 */
exports.recommendCocktail = function(req, res) {
  var id_cocktail = req.params.id_cocktail;
  mongo.Db.connect(mongoUri, function (err, db) {
    db.collection('cocktails_admin', function(err, collection) {
      console.log('Unchecking recommended cocktails...');
      collection.update({}, {$unset: {recomendado: 1}}, {safe: true, multi: true}, function(err, object) {
        if (!err) {
          console.log('Uncheck successful!');
          console.log('Checking recommended cocktail: ' + id_cocktail);
          collection.update({'_id': new BSON.ObjectID(id_cocktail)}, {$set: {recomendado: 1}}, {safe: true}, function(err, object) {
            if (!err) {
              console.log(object);
              console.log(err);
              console.log('Check successful!');
              res.send({
                id_cocktail: id_cocktail
              });
            } else {
              console.log('Check unsuccessful...');
            }
          }); //Linea magica 2: tampoco tocar!
        } else {
          console.log('Uncheck unsuccessful...');
        }
      });
    });
  });
}

/**
 * Llista els cocktails que ha creat l'administrador (els que poden ser recomanats)
 *
 * @param req
 * @param res
 *
 * @author  jclara
 * @version 1.0
 * @date    2013-05-04
 */
exports.cocktails = function(req, res) {
  mongo.Db.connect(mongoUri, function (err, db) {
    db.collection('cocktails_admin', function(err, collection) {
      collection.find().sort({nombre: 1}).toArray(function(err, items) {
        res.send(items);
      });
    });
  });
}

/**
 * Retorna un cocktail de l'administrador pel seu id.
 *
 * @param req
 * @param res
 *
 * @author  jclara
 * @version 1.0
 * @date    2013-05-04
 */
exports.findCktlById = function(req, res) {
  var id = req.params.id_cocktail;
  console.log('Retrieving admin cocktail: ' + id);
  mongo.Db.connect(mongoUri, function (err, db) {
    db.collection('cocktails_admin', function(err, collection) {
      collection.findOne({'_id': new BSON.ObjectID(id)}, function(err, cktl) {
        if (!err) {
          res.send(cktl);
        } else {
          console.log("Error: admin cocktail " + id + " doesn't exist");
        }
      });
    });
  });
}

/**
 * Crea un cocktail de l'administrador nou.
 *
 * @param req
 * @param res
 *
 * @author  jclara
 * @version 1.0
 * @date    2013-05-05
 */
exports.createCocktail = function(req, res) {
  var cktl = req.body;
  console.log('Receiving admin cocktail: ' + cktl.nombre);
  //Comprovem que els camps del cocktail siguin els correctes
  if (cktl.zumos && cktl.licores && cktl.carbonico && cktl.vaso && cktl.nombre) {
    mongo.Db.connect(mongoUri, function (err, db) {
      db.collection('cocktails_admin', function(err, collection) {
        //Filtrem la resta de camps
        var color = getColor(cktl.zumos);
        var cktl_ok =
        {
          zumos:      [cktl.zumos],
          licores:    [cktl.licores],
          carbonico:  cktl.carbonico,
          vaso:       cktl.vaso,
          nombre:     cktl.nombre,
          imagen:     ("/images/cocktails/" + cktl.vaso + "_" + color + ".jpg").replace(/ /g, "_")
        };
        collection.insert(cktl_ok, function(err, item) {
          if (!err) {
            console.log("Admin cocktail inserted: " + cktl_ok.nombre);
            res.render('backend',
              {
                title: 'Zona de administraci&oacute;n',
                error_cktl: '',
                msg_cktl: 'Cocktail creado correctamente',
                error_ingredient: '',
                msg_ingredient: ''
              }
            );
          } else {
            console.log("Error: admin cocktail couldn't be inserted: " + cktl_ok.nombre);
            console.log(err);
            res.render('backend',
              {
                title: 'Zona de administraci&oacute;n',
                error_cktl: 'Hubo un error insertando el cocktail.',
                msg_cktl: '',
                error_ingredient: '',
                msg_ingredient: ''
              }
            );
          }
        });
      })
    });
  } else {
    console.log("Error: admin cocktail not inserted (missing fields).");
    console.log("Juices: " + cktl.zumos);
    console.log("Liqueurs: " + cktl.licores);
    console.log("Soda: " + cktl.carbonico);
    console.log("Glass: " + cktl.vaso);
    console.log("Name: " + cktl.nombre);
    res.render('backend',
      {
        title: 'Zona de administraci&oacute;n',
        error_cktl: 'Faltan campos en la creaci&oacute;n del cocktail.',
        msg_cktl: '',
        error_ingredient: '',
        msg_ingredient: ''
      }
    );
  }
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
  if (typeof zumos === 'string') {
    zumos = [zumos];
  }
  zumos.forEach(function(zumo, i, zumos) {
    if (zumo == "Fresa" || zumo == "Sandía" || zumo == "Pomelo") {
      totales[i] = "Rojo";
    } else if (zumo == "Naranja" || zumo == "Melocotón" || zumo == "Mango" || zumo == "Fruta de la pasión") {
      totales[i] = "Naranja";
    } else if (zumo == "Melón") {
      totales[i] = "Verde";
    } else {
      totales[i] = "Amarillo";
    }
  });
  var color = totales[Math.floor(Math.random()*totales.length)];
  return color;
}

function populateDB() {
  console.log('Creating registered users collection...');
  var admin =
  {
    user: 'admin',
    pass: '8c6976e5b5410415bde908bd4dee15dfb167a9c873fc4bb8a81f6f2ab448a918'
  };

  mongo.Db.connect(mongoUri, function (err, db) {
    db.collection('reg_users', function(err, collection) {
      collection.insert(admin, {safe:true}, function(err, result) {});
    });
  });
}

