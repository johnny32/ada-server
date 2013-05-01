/**
 * Created with JetBrains WebStorm.
 * User: Johnny
 * Date: 1/05/13
 * Time: 18:19
 * To change this template use File | Settings | File Templates.
 */
function checkErrors(error_box) {
  if (error_box.text() == '') {
    error_box.hide();
  }
}