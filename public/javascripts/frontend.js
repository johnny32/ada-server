/**
 * Created with JetBrains WebStorm.
 * User: Johnny
 * Date: 11/05/13
 * Time: 17:33
 * To change this template use File | Settings | File Templates.
 */
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
          $.ajax({
            type : "GET",
            url : "http://graph.facebook.com/" + cktl.creador,
            dataType : "json",
            async : false,
            success : function(data2){
              var txt = '<h1>Cocktail "' + cktl.nombre + '"</h1>'
                + '<p><strong>Creado por:</strong> <a href="http://www.facebook.com/' + cktl.creador + '">' + data2.name + '</a><br>'
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
            },
            error: function(header, status, from){
              console.log("Error retrieving Facebook user: " + id_facebook);
            }
          });


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
    url: '/image',
    method: 'post',
    dataType: 'json',
    data: {
      vaso: cktl.vaso,
      zumos: cktl.zumos
    },
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

function cargarRatings(id_cktl, usuario) {
  $('#ratings').empty();
  $.ajax({
    url: '/ratings/' + id_cktl + '/' + usuario,
    method: 'get',
    dataType: 'json',
    success: function(data) {
      if (data.rating != -1) {
        $('#ratings').html('<p>Has puntuado este cocktail con: <img src="/images/ratings/r' + data.rating + '.png" alt="Puntuacion" width="50" /></p>');
      } else {
        cargarFormRatings(id_cktl, usuario);
      }
    },
    error: function() {
      cargarFormRatings(id_cktl, usuario);
    }
  });
}

function cargarFormRatings(id_cktl, usuario) {
  var container = $('#ratings');
  var form = $('<form>', {
    method: 'post',
    action: '/web/ratings'
  });
  $(form).append('<input type="hidden" name="id_cocktail" value="' + id_cktl + '" />');
  $(form).append('<input type="hidden" name="id_user" value="' + usuario + '" />');
  $(form).append('<input type="hidden" name="rating" id="ratingField" />');
  $(form).append('<button type="submit" onclick="ponerValor(1)"><img src="/images/ratings/r1.png" alt="Muy mal" width="50" /></button>');
  $(form).append('<button type="submit" onclick="ponerValor(2)"><img src="/images/ratings/r2.png" alt="Mal" width="50" /></button>');
  $(form).append('<button type="submit" onclick="ponerValor(3)"><img src="/images/ratings/r3.png" alt="Regular" width="50" /></button>');
  $(form).append('<button type="submit" onclick="ponerValor(4)"><img src="/images/ratings/r4.png" alt="Bien" width="50" /></button>');
  $(form).append('<button type="submit" onclick="ponerValor(5)"><img src="/images/ratings/r5.png" alt="Muy bien"width="50"  /></button>');
  $(container).append(form);
}

function ponerValor(valor) {
  $('#ratingField').val(valor);
}