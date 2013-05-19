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
  } else {
    fld.removeClass('hide');
  }
}

/**
 * Retorna el link al perfil de facebook de l'usuari
 *
 * @param id
 *
 * @author  jclara
 * @version 2.0
 * @date    2013-05-04
 */
function getUser(id_facebook) {

}