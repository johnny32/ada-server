/**
 * Created with JetBrains WebStorm.
 * User: Johnny
 * Date: 11/05/13
 * Time: 17:33
 * To change this template use File | Settings | File Templates.
 */

var id_user = "johnny32";


function cargarCocktail(id) {
  var progressbar = $('#pb-bar')[0];
  $(progressbar.parentElement).removeClass('hide');
  var cktlinfo = $('#info-container');
  $.ajax({
    url: '/cocktails/' + id,
    method: 'get',
    dataType: 'json',
    beforeSend: function(hdr) {
      progressbar.style.width = '15%';
    },
    success: function(cktl, textStatus, jqXHR) {
      progressbar.style.width = '30%';
      $.ajax({
        url: '/ratings/' + id,
        method: 'get',
        dataType: 'json',
        success: function(rating) {
          var txt = '<h1>Cocktail "' + cktl.nombre + '"</h1>'
              + '<p><strong>Creado por:</strong> ' + getUser(cktl.creador) + '<br>'
              + '<strong>Zumos:</strong> ' + cktl.zumos.join(', ') + '<br>'
              + '<strong>Licores:</strong> ' + cktl.licores.join(', ') + '<br>'
              + '<strong>Carb&oacute;nico:</strong> ' + cktl.carbonico + '<br>'
              + '<strong>Puntuaci&oacute;n media:</strong> ';
          if (Math.round(rating.rating) > 0) {
            txt += '<img src="/images/ratings/r' + Math.round(rating.rating) + '.png" alt="Puntuacion" width="50" /></p>';
          } else {
            txt += 'Nadie ha puntuado este cocktail a&uacute;n</p>';
          }
          $(cktlinfo).append(txt);
          progressbar.style.width = '60%';
          cargarImgCocktail(cktl, progressbar);
          cargarRatings(cktl);
        }
      });

    },
    error: function(jqXHR, textStatus, errorThrown) {
      $(progressbar.parentElement).addClass('progress-danger');
      $('#errors').text('Error recuperando el cocktail: ' + jqXHR.status + ' ' + errorThrown).removeClass('hide');
    }
  });
}

function cargarImgCocktail(cktl, progressbar) {
  $.ajax({
    url: '/image/' + cktl.vaso + '/' + cktl.color,
    method: 'get',
    dataType: 'json',
    beforeSend: function(hdr) {
      progressbar.style.width = '70%';
    },
    success: function(imagen, textStatus, jqXHR) {
      progressbar.style.width = '85%';
      var img = $('<img>', {
        src: imagen.img,
        alt: 'Cocktail ' + cktl.nombre
      });
      $('#cktl-img').append(img);
      progressbar.style.width = '100%';
      setTimeout(eliminarBarra(progressbar), 500);
    },
    error: function(jqXHR, textStatus, errorThrown) {
      $(progressbar.parentElement).addClass('progress-danger');
      $('#errors').text('Error recuperando imagen del cocktail: ' + jqXHR.status + ' ' + errorThrown).removeClass('hide');
    }
  });
}

function eliminarBarra(progressbar) {
  $(progressbar.parentElement).addClass('hide');
  $('#cktl-info').removeClass('hide');
  $('#cktl-img').removeClass('hide');
  $('#ratings').removeClass('hide');
}

function cargarRatings(cktl) {
  if (id_user) {
    $.ajax({
      url: '/ratings/' + cktl._id + '/' + id_user,
      method: 'get',
      dataType: 'json',
      success: function(data) {
        if (data.rating != -1) {
          $('#ratings').html('<p>Has puntuado este cocktail con: <img src="/images/ratings/r' + data.rating + '.png" alt="Puntuacion" width="50" /></p>');
        }
      }
    })
  }
}