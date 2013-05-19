
/*
 * GET home page.
 */

/**
 * Mostra la pagina principal.
 *
 * @param req
 * @param res
 *
 * @author  jclara
 * @version 1.0
 * @date    2013-05-18
 */
exports.index = function(req, res){
  res.render('index', { title: 'Sinatra Cockteleria' });
};