
/*
 * GET users listing.
 */

var mongo = require('mongodb');

var mongoUri = process.env.MONGOLAB_URI ||
    process.env.MONGOHQ_URL ||
    'mongodb://localhost/sinatra';

var BSON = mongo.BSONPure;


/**
 * Serveix un usuari per id
 *
 * @param req
 * @param res
 *
 * @author  jclara
 * @version 2.0
 * @date    2013-04-11
 */
exports.findById = function(req, res) {
  var id = req.params.id;
  console.log('Retrieving user: ' + id);
  mongo.Db.connect(mongoUri, function (err, db) {
    db.collection('users', function(err, collection) {
      collection.findOne({'_id': new BSON.ObjectID(id)}, function(err, item) {
        if (!err) {
          res.send(item);
        } else {
          console.log("Error: user " + id + " doesn't exist.");
        }
      });
    });
  });
}

/**
 * Busca un usuari per id de Facebook.
 *
 * @param req
 * @param res
 *
 * @author  jclara
 * @version 1.0
 * @date    2013-04-11
 */
exports.findByFacebook = function(req, res) {
  var id_facebook = req.params.id_facebook;
  console.log('Retrieving user with id_facebook: ' + id_facebook);
  mongo.Db.connect(mongoUri, function (err, db) {
    db.collection('users', function(err, collection) {
      collection.findOne({'id_facebook': id_facebook}, function(err, item) {
        if (!err) {
          res.send(item);
        } else {
          console.log("Error: user " + id_facebook + " doesn't exist.");
        }
      });
    });
  });
}

/**
 * Busca un usuari per id de Twitter.
 *
 * @param req
 * @param res
 *
 * @author  jclara
 * @version 1.0
 * @date    2013-04-11
 */
exports.findByTwitter = function(req, res) {
  var id_twitter = req.params.id_twitter;
  console.log('Retrieving user with id_twitter: ' + id_twitter);
  mongo.Db.connect(mongoUri, function (err, db) {
    db.collection('users', function(err, collection) {
      collection.findOne({'id_twitter': id_twitter}, function(err, item) {
        if (!err) {
          res.send(item);
        } else {
          console.log("Error: user " + id_twitter + " doesn't exist.");
        }
      });
    });
  });
}

/**
 * Llista tots els usuaris (borrar a la versio final, perque no te sentit que es pugui fer).
 *
 * @param req
 * @param res
 *
 * @author  jclara
 * @version 1.0
 * @date    2013-04-11
 */
exports.list = function(req, res) { //TODO Esborrar aquesta funcio
  mongo.Db.connect(mongoUri, function (err, db) {
    db.collection('users', function(err, collection) {
      collection.find().toArray(function(err, items) {
        res.send(items);
      });
    });
  });
}

/**
 * Llista tots els amics (Facebook) i seguits (Twitter) de l'usuari que hi ha a l'aplicacio.
 *
 * @param req
 * @param res
 *
 * @author  jclara
 * @version 1.0
 * @date    2013-04-18
 */
exports.friends = function(req, res) {
  //TODO Necessitem token d'app (a Facebook)
}

/**
 * Crea dades de prova per la base de dades.
 *
 * @author  jclara
 * @version 1.0
 * @date    2013-04-11
 */
var populateDB = function() {
  var users = [
    {
      id_facebook:  "johnny32",
      id_twitter:   "jooohnny32"
    },
    {
      id_facebook:  "JosepManrique",
      id_twitter:   "Josep_Manrique"
    },
    {
      id_twitter:   "BillGates"
    },
    {
      id_facebook:  "PaulMcCartney"
    },
    {
      id_twitter:   "sinatracoctel"
    }
  ];

  db.collection('users', function(err, collection) {
    collection.insert(users, {safe:true}, function(err, result) {});
  });
}