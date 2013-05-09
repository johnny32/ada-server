/**
 * Created with JetBrains WebStorm.
 * User: Johnny
 * Date: 1/05/13
 * Time: 18:19
 * To change this template use File | Settings | File Templates.
 */
function checkField(fld) {
  if (fld.text() == '') {
    fld.addClass('hide');
  }
}

/**
 * Obte un usuari pel seu id i mostra els links al seu perfil de Facebook i de Twitter
 *
 * @param id
 *
 * @author  jclara
 * @version 1.0
 * @date    2013-05-04
 */
function getUser(id) {
  var txt = '';
  $.ajax({
    url: '/users/' + id,
    method: 'get',
    dataType: 'json',
    async: false,
    success: function(user) {
      if (user.id_facebook) {
        txt = '<a href="http://www.facebook.com/' + user.id_facebook + '">Perfil de Facebook de ' + user.id_facebook + '</a>';
      }
      if (user.id_twitter) {
        if (txt != '') {
          txt += ' - ';
        }
        txt += '<a href="http://twitter.com/' + user.id_twitter + '">Perfil de Twitter de ' + user.id_twitter + '</a>';
      }
    },
    error: function(jqXHR, textStatus, errorThrown) {
      txt = '<span class="error">Error recuperando el usuario:' + jqXHR.status + ' ' + errorThrown + '</span>';
    }
  });
  return txt;
}