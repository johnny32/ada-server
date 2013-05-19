/**
 * Created with JetBrains WebStorm.
 * User: Johnny
 * Date: 5/05/13
 * Time: 19:19
 * To change this template use File | Settings | File Templates.
 */
function cargarCocktails() {
  var progressbar = $('#pb-cocktails')[0];
  $(progressbar.parentElement).removeClass('hide');
  var ulcocktails = $('#ul-cocktails');
  $(ulcocktails).empty();
  $('#div-dropdown').addClass('hide');
  $('#btn-new-cktl').addClass('hide');
  $.ajax({
    url: '/cocktails_admin',
    method: 'get',
    dataType: 'json',
    beforeSend: function(header) {
      progressbar.style.width = '40%';
    },
    success: function(data, textStatus, jqXHR) {
      progressbar.style.width = '80%';
      $.each(data, function(i, cktl){
        var style = '';
        if (cktl.recomendado) {
          var style = 'font-weight: bold;';
          $("#recommended-cocktail h2").text("Cocktail recomendado: " + cktl.nombre);
        }
        var link = $('<a>', {
          href: '#info-cktl',
          style: style,
          click: function() {
            loadCocktail(cktl);
          },
          text: cktl.nombre
        });
        link.attr('data-toggle', 'modal');
        var li = $('<li>', {});
        li.append(link);
        ulcocktails.append(li);
      });
      progressbar.style.width = '100%';
      setTimeout(eliminarBarraCocktails, 500);
    },
    error: function(jqXHR, textStatus, errorThrown) {
      $(progressbar.parentElement).addClass('progress-danger');
      $('#error_cktl').text('Error recuperando la lista de cocktails: ' + jqXHR.status + ' ' + errorThrown).removeClass('hide');
    }
  });
}

function eliminarBarraCocktails() {
  var progressbar = $('#pb-cocktails')[0];
  $(progressbar.parentElement).addClass('hide');
  $('#div-dropdown').removeClass('hide');
  $('#btn-new-cktl').removeClass('hide');
}

function loadCocktail(cktl) {
  $('#info-cktl-title').text('Cocktail ' + cktl.nombre);
  $('#info-cktl-img').empty().append($('<img>', {
    src: cktl.imagen,
    alt: 'Cocktail ' + cktl.nombre
  }));
  $('#info-cktl-info').append('<p><strong>Nombre:</strong> ' + cktl.nombre + '<br>'
    + '<strong>Zumos:</strong> ' + cktl.zumos.join(', ') + '<br>'
    + '<strong>Licores:</strong> ' + cktl.licores.join(', ') + '<br>'
    + '<strong>Carb&oacute;nico:</strong> ' + cktl.carbonico + '<br>'
    + '<strong>Vaso:</strong> ' + cktl.vaso + '</p>');
  $('#info-cktl-guardar').unbind('click').click(function() {
    recomendarCocktail(cktl._id);
  });

}

function recomendarCocktail(id) {
  $.ajax({
    url: '/admin/recommend',
    method: 'post',
    data: {
      id_cocktail: id
    },
    success: function(data) {
      $('#info-cktl').modal('hide');
      cargarCocktails();
    },
    error: function(jqXHR, textStatus, errorThrown) {
      alert("ERROR!");
      console.log(jqXHR);
      console.log(textStatus);
      console.log(errorThrown);
    }
  });
}

function nuevoCocktail() {
  $.ajax({
    url: '/ingredients/tipo/Zumo',
    method: 'get',
    dataType: 'json',
    success: function(data) {
      $.each(data, function(i, item) {
        var opt = new Option(item.descripcion, item.descripcion);
        $('#inputZumos').append(opt);
      });
    }
  });
  $.ajax({
    url: '/ingredients/tipo/Licor',
    method: 'get',
    dataType: 'json',
    success: function(data) {
      $.each(data, function(i, item) {
        var opt = new Option(item.descripcion, item.descripcion);
        $('#inputLicores').append(opt);
      });
    }
  });
  $.ajax({
    url: '/ingredients/tipo/Carbonico',
    method: 'get',
    dataType: 'json',
    success: function(data) {
      $.each(data, function(i, item) {
        var opt = new Option(item.descripcion, item.descripcion);
        $('#inputCarbonico').append(opt);
      });
    }
  });
  $.ajax({
    url: '/ingredients/tipo/Vaso',
    method: 'get',
    dataType: 'json',
    success: function(data) {
      $.each(data, function(i, item) {
        var opt = new Option(item.descripcion, item.descripcion);
        $('#inputVaso').append(opt);
      });
    }
  });

  $('#new-cktl').modal();
}

function cargarIngredientes() {
  var completado = 0;
  var progressbar = $('#pb-ingredients')[0];
  $(progressbar.parentElement).removeClass('hide');
  var ulzumos = $('#ul-zumos');
  var ullicores = $('#ul-licores');
  var ulcarbonicos = $('#ul-carbonicos');
  var ulvasos = $('#ul-vasos');
  $(ulzumos).empty();
  $(ullicores).empty();
  $(ulcarbonicos).empty();
  $(ulvasos).empty();
  $('#drop-zumos').addClass('hide');
  $('#drop-licores').addClass('hide');
  $('#drop-carbonicos').addClass('hide');
  $('#drop-vasos').addClass('hide');
  progressbar.style.width = completado + '%';
  $.ajax({
    url: '/ingredients/tipo/Zumo',
    method: 'get',
    dataType: 'json',
    success: function(data, textStatus, jqXHR) {
      $.each(data, function(i, item){
        var a = $('<a>', {text: item.descripcion});
        var li = $('<li>', {});
        li.append(a);
        ulzumos.append(li);
      });
      completado += 25;
      progressbar.style.width = completado + '%';
      if (completado == 100) {
        setTimeout(eliminarBarraIngredientes, 500);
      }
    },
    error: function(jqXHR, textStatus, errorThrown) {
      $(progressbar.parentElement).addClass('progress-danger');
      $('#error_ingredient').text('Error recuperando la lista de zumos: ' + jqXHR.status + ' ' + errorThrown).removeClass('hide');
    }
  });
  $.ajax({
    url: '/ingredients/tipo/Licor',
    method: 'get',
    dataType: 'json',
    success: function(data, textStatus, jqXHR) {
      $.each(data, function(i, item){
        var a = $('<a>', {text: item.descripcion});
        var li = $('<li>', {});
        li.append(a);
        ullicores.append(li);
      });
      completado += 25;
      progressbar.style.width = completado + '%';
      if (completado == 100) {
        setTimeout(eliminarBarraIngredientes, 500);
      }
    },
    error: function(jqXHR, textStatus, errorThrown) {
      $(progressbar.parentElement).addClass('progress-danger');
      $('#error_ingredient').text('Error recuperando la lista de licores: ' + jqXHR.status + ' ' + errorThrown).removeClass('hide');
    }
  });
  $.ajax({
    url: '/ingredients/tipo/Carbonico',
    method: 'get',
    dataType: 'json',
    success: function(data, textStatus, jqXHR) {
      $.each(data, function(i, item){
        var a = $('<a>', {text: item.descripcion});
        var li = $('<li>', {});
        li.append(a);
        ulcarbonicos.append(li);
      });
      completado += 25;
      progressbar.style.width = completado + '%';
      if (completado == 100) {
        setTimeout(eliminarBarraIngredientes, 500);
      }
    },
    error: function(jqXHR, textStatus, errorThrown) {
      $(progressbar.parentElement).addClass('progress-danger');
      $('#error_ingredient').text('Error recuperando la lista de carbónicos: ' + jqXHR.status + ' ' + errorThrown).removeClass('hide');
    }
  });
  $.ajax({
    url: '/ingredients/tipo/Vaso',
    method: 'get',
    dataType: 'json',
    success: function(data, textStatus, jqXHR) {
      $.each(data, function(i, item){
        var a = $('<a>', {text: item.descripcion});
        var li = $('<li>', {});
        li.append(a);
        ulvasos.append(li);
      });
      completado += 25;
      progressbar.style.width = completado + '%';
      if (completado == 100) {
        setTimeout(eliminarBarraIngredientes, 500);
      }
    },
    error: function(jqXHR, textStatus, errorThrown) {
      $(progressbar.parentElement).addClass('progress-danger');
      $('#error_ingredient').text('Error recuperando la lista de vasos: ' + jqXHR.status + ' ' + errorThrown).removeClass('hide');
    }
  });
}

function eliminarBarraIngredientes() {
  var progressbar = $('#pb-ingredients')[0];
  $(progressbar.parentElement).addClass('hide');
  $('#drop-zumos').removeClass('hide');
  $('#drop-licores').removeClass('hide');
  $('#drop-carbonicos').removeClass('hide');
  $('#drop-vasos').removeClass('hide');
  $('#btn-new-ingredient').removeClass('hide');
}

function nuevoIngrediente() {
  $('#new-ingredient').modal();
}