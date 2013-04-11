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

exports.list = function(req, res) {
  db.collection('cocktails', function(err, collection) {
    collection.find().toArray(function(err, items) {
      res.send(items);
    });
  });
}

/*--------------------------------------------------------------------------------------------------------------------*/
// Populate database with sample data -- Only used once: the first time the application is started.
// You'd typically not find this code in a real-life app, since the database would already exist.
var populateDB = function() {
  var cocktails = [
    {
      name:         "El mejor",
      author:       "Johnny",
      ingredients:  ["Cerveza", "Mas cerveza", "Mucha mas cerveza"],
      rating:       9.5
    },
    {
      name:         "Hercorzumo",
      author:       "Hercules",
      ingredients:  ["Zumo de los dioses"],
      rating:       9.1
    },
    {
      name:         "Cocktail de zanahoria",
      author:       "Bugs Bunny",
      ingredients:  ["Zanahoria", "Vodka"],
      rating:       8.5
    },
    {
      name:         "Grog",
      author:       "Guybrush Threepwood",
      ingredients:  ["queroseno", "glicol propilico", "endulzantes artificiales", "acido sulfurico", "ron", "acetona", "tinte rojo n2", "SCUMM", "grasa para ejes", "acido para baterias", "pepperoni"],
      rating:       8
    },
    {
      name:         "Absenta negra",
      author:       "Metaleros unidos S.A.",
      ingredients:  ["absenta", "color negro"],
      rating:       6.66
    },
    {
      name:         "Sunset Sarsaparilla",
      author:       "Bethesda",
      ingredients:  ["sunset", "nuka cola", "agua radioactiva"],
      rating:       5.25
    },
    {
      name:         "Basura de cocktail",
      author:       "Xose",
      ingredients:  ["Guild Wars 2", "es una mierda"],
      rating:       3.5
    }
  ];

  db.collection('cocktails', function(err, collection) {
    collection.insert(cocktails, {safe:true}, function(err, result) {});
  })
}
