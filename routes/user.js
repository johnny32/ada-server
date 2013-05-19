
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
exports.list = function(req, res) {
  mongo.Db.connect(mongoUri, function (err, db) {
    db.collection('users', function(err, collection) {
      collection.find().toArray(function(err, items) {
        res.send(items);
      });
    });
  });
}
