
/*
 * GET home page.
 */

exports.index = function(req, res){
  //TODO Crear pagina principal
  res.render('index', { title: 'Express' });
};