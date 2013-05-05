/**
 * Created with JetBrains WebStorm.
 * User: Johnny
 * Date: 5/05/13
 * Time: 19:19
 * To change this template use File | Settings | File Templates.
 */
function cargarCocktails() {
  var progressbar = $('#progress-bar')[0];
  $(progressbar.parentElement).removeClass('hide');
  var ulcocktails = $('#ul-cocktails');
  $(ulcocktails).empty();
  $('#div-dropdown').addClass('hide');
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
      setTimeout(eliminarBarra, 500);
    },
    error: function(jqXHR, textStatus, errorThrown) {
      $(progressbar.parentElement).addClass('progress-danger');
      $('#errors-cocktail-list').text('Error recuperando la lista de cocktails: ' + jqXHR.status + ' ' + errorThrown).removeClass('hide');
    }
  });
}

function eliminarBarra() {
  var progressbar = $('#progress-bar')[0];
  $(progressbar.parentElement).addClass('hide');
  $('#div-dropdown').removeClass('hide');
  $('#btn-new').removeClass('hide');
}

function loadCocktail(cktl) {
  $('#info-cktl-title').text('Cocktail ' + cktl.nombre);
  loadImageCocktail(cktl.nombre, cktl.vaso, cktl.color);
  $('#info-cktl-info').append('<p><strong>Nombre:</strong> ' + cktl.nombre + '<br>'
    + '<strong>Zumos:</strong> ' + cktl.zumos.join(', ') + '<br>'
    + '<strong>Licores:</strong> ' + cktl.licores.join(', ') + '<br>'
    + '<strong>Carb&oacute;nico:</strong> ' + cktl.carbonico + '</p>');
  $('#info-cktl-guardar').unbind('click').click(function() {
    recomendarCocktail(cktl._id);
  });
}

function loadImageCocktail(nombre, vaso, color) {
  var img = $('#info-cktl-img');
  img.append('Loading...'); //TODO Posar un gif o una animacio
  $.ajax({
    url: '/image/' + vaso + '/' + color,
    method: 'get',
    dataType: 'json',
    success: function(data) {
      img.empty();
      img.append($('<img>', {
        src: data.img,
        alt: 'Cocktail ' + nombre
      }));
    },
    error: function(jqXHR, textStatus, errorThrown) {

    }
  });
}

function recomendarCocktail(id) {
  $.ajax({
    url: '/admin/recommend/' + id,
    method: 'get',
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
        var opt = new Option(item.descripcion, item._id);
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
        var opt = new Option(item.descripcion, item._id);
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
        var opt = new Option(item.descripcion, item._id);
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
        var opt = new Option(item.descripcion, item._id);
        $('#inputVaso').append(opt);
      });
    }
  });
  $.ajax({
    url: '/ingredients/tipo/Color',
    method: 'get',
    dataType: 'json',
    success: function(data) {
      $.each(data, function(i, item) {
        var opt = new Option(item.descripcion, item._id);
        $('#inputColor').append(opt);
      });
    }
  });

  $('#new-cktl').modal();
}