/**
 * Created with JetBrains WebStorm.
 * User: Johnny
 * Date: 28/04/13
 * Time: 12:52
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
    db.collection('users', {strict: true}, function(err, collection) {
      if (err) {
        console.log("The 'reg_users' collection doesn't exist. Creating it with sample data...");
        populateDB();
      }
    });
  }
});

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
      title: 'Zona de administraci&oacute;n'
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
  db.collection('reg_users', function(err, collection) {
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
  db.collection('cocktails', function(err, collection) {
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
              id_cocktail: '2'
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
}

function populateDB() {
  console.log('Creating registered users collection...');
  var admin =
  {
    user: 'admin',
    pass: '8c6976e5b5410415bde908bd4dee15dfb167a9c873fc4bb8a81f6f2ab448a918'
  };

  db.collection('reg_users', function(err, collection) {
    collection.insert(admin, {safe:true}, function(err, result) {});
  });
}