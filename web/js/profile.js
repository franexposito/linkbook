var user = "";

$(document).ready(function() {
  $('body').on('click', 'a', function(){
    if ( $(this).hasClass('de') ) {
      var id = $(this).data('id');
      var success = deleteClip(id);
      if (success == true) {
        $(this).parent().parent().fadeOut();
      }
      return false;
    }
  });
  
  if (localStorage.zasdfvslinkbookudsdfeuws && localStorage.zasdfvslinkbookudsdfeaws){
    user = localStorage.zasdfvslinkbookudsdfeuws;
    var auth = localStorage.zasdfvslinkbookudsdfeaws;
    var success = checkUserAuth(user, auth);
    if( success == 'true' ){
      loadLinks(user);  
    }
    else {
      window.location.replace("/");
    }
  }else {
    window.location.replace("/");
  }

  $('#bye').on('click', function(evt){
    evt.preventDefault();
    if (localStorage.zasdfvslinkbookudsdfeuws) { localStorage.removeItem("zasdfvslinkbookudsdfeuws"); }
    if (localStorage.zasdfvslinkbookudsdfeaws) { localStorage.removeItem("zasdfvslinkbookudsdfeaws"); }
    window.location.replace("/");
  });
  
  $("#actualizar").on('click', function(evt){
    evt.preventDefault();
    $('.link-container').remove();
    $('.loader').css('display', 'block');
    loadLinks(user);
  });
  
  $('#send').on('click', function(evt) {
    evt.preventDefault();
    var expression = /^(http:\/\/|https:\/\/)?((([\w-]+\.)+[\w-]+)|localhost)(\/[\w- .\/?%&=]*)?/i; 
    var url = $('#link').val();
    
    if (url == '') { $(".msg").text('Introduzca una url').show(); }
    else if (!expression.test(url)) { $(".msg").text('La url introducida no es válida').show(); }
    else {
      $(".msg").text('').hide();
      sendLink(url);
    }
  });
  
  $('#link').on('blur', function(){
    if ( $('.msg').css('display') == 'block' ) { $('.msg').text('').hide(); }
  });
  
  $('.arrow').on('hover', function(){
    $(this).css('cursor','pointer');
  });
  
  $('.arrow').on('click', function() {
    if ($(this).parent().next('div').is(":visible"))  {
      $(this).parent().next("div").hide();
      $(this).removeClass('glyphicon-collapse-up');
      $(this).addClass('glyphicon-collapse-down');
    }
    else {
      $(this).parent().next("div").show();
      $(this).addClass('glyphicon-collapse-up');
      $(this).removeClass('glyphicon-collapse-down');
    }
  });
  
});

function loadLinks(user) {
  var date = new Date();
  var ahora = date.format("yyyy-mm-dd HH:MM:ss");
  var hoy00 = date.format("yyyy-mm-dd 00:00:00");
  date.setDate(date.getDate() - 1);
  var ayer00 = date.format("yyyy-mm-dd 00:00:00");

  var conn = "inc/getClips.php";

  var xhr = new XMLHttpRequest();
  xhr.onreadystatechange = function() {
      if (xhr.readyState == 4) {
        if (xhr.status == 200) {
          var resp = JSON.parse(xhr.responseText);
          if (resp.result == false) { alert('error'); }
          if (resp.result == true) { 
            var hoy = resp.hoy;
            $("#l-hoy").css('display', 'none');
            $.each(hoy, function(index, key) {
              var urlHref = haveHttp(hoy[index].url);
              var urlShort = shortUrl(hoy[index].url);
              var source = '';
              if ( hoy[index].source == 'web') { source = '1405441725_computer.png'; } else { source = '1405441720_phone.png'; }
              var clip = '<article class="col-sm-12 link-container"><div class="col-sm-1 col-xs-1 type"><img alt="móvil"src="img/'+source+'" /></div><div class="col-sm-10 col-xs-10 enlace"><a target="_blank" href="'+urlHref+'">'+urlShort+'</a></div><div class="col-sm-1 col-xs-1 del"><a data-id="'+hoy[index].id+'" class="de" href="#">x</a></div></article>';
            $('.hoy').append(clip);
            });
            var ayer = resp.ayer;
            $("#l-ayer").css('display', 'none');
            $.each(ayer, function(index, key) {
              var urlHref = haveHttp(ayer[index].url);
              var urlShort = shortUrl(ayer[index].url);
              var source = '';
              if ( ayer[index].source == 'web') { source = '1405441725_computer.png'; } else { source = '1405441720_phone.png'; }
              var clip = '<article class="col-sm-12 link-container"><div class="col-sm-1 col-xs-1 type"><img alt="móvil"src="img/'+source+'" /></div><div class="col-sm-10 col-xs-10 enlace"><a target="_blank" href="'+urlHref+'">'+urlShort+'</a></div><div class="col-sm-1 col-xs-1 del"><a data-id="'+ayer[index].id+'" class="de" href="#">x</a></div></article>';
            $('.ayer').append(clip);
            });
            var anteriores = resp.anteriores;
            $("#l-antes").css('display', 'none');
            $.each(anteriores, function(index, key) {
              var urlHref = haveHttp(anteriores[index].url);
              var urlShort = shortUrl(anteriores[index].url);
              var source = '';
              if ( anteriores[index].source == 'web') { source = '1405441725_computer.png'; } else { source = '1405441720_phone.png'; }
              var clip = '<article class="col-sm-12 link-container"><div class="col-sm-1 col-xs-1 type"><img alt="móvil"src="img/'+source+'" /></div><div class="col-sm-10 col-xs-10 enlace"><a target="_blank" href="'+urlHref+'">'+urlShort+'</a></div><div class="col-sm-1 col-xs-1 del"><a data-id="'+anteriores[index].id+'" class="de" href="#">x</a></div></article>';
            $('.antes').append(clip);
            });
        }
      }
    }
  }
  xhr.open("POST", conn, true);
  xhr.setRequestHeader("Content-type","application/x-www-form-urlencoded");
  xhr.send("user="+user+"&ahora="+ahora+"&hoy00="+hoy00+"&ayer00="+ayer00+"");
}

function sendLink(url) {
  var date = new Date();
  var ahora = date.format("yyyy-mm-dd HH:MM:ss");
  var source = 'web';
  
  var conn = "inc/addUrl2.php";
  var data = JSON.stringify({'user':user, "date":ahora, "url":url, "source":source});
  
  var xhr = new XMLHttpRequest();
  xhr.onreadystatechange = function() {
      if (xhr.readyState == 4) {
        if (xhr.status == 200) {
          var resp = JSON.parse(xhr.responseText);
          if (resp.result == true ) {
            var urlHref = haveHttp(url);
            var urlShort = shortUrl(url);
            var clip = '<article class="col-sm-12 link-container"><div class="col-sm-1 col-xs-1 type"><img alt="móvil"src="img/1405441725_computer.png" /></div><div class="col-sm-10 col-xs-10 enlace"><a target="_blank" href="'+urlHref+'">'+urlShort+'</a></div><div class="col-sm-1 col-xs-1 del"><a data-id="'+resp.id+'" class="de" href="">x</a></div></article>';
            $('.hoy').prepend(clip).fadeIn();
            $('#link').val('');
          }
        }
      }
  }

  xhr.open("POST", conn, false);
  xhr.setRequestHeader('Content-type','application/json; charset=utf-8');
  xhr.send(data);
}

function haveHttp(url) {
  var url2 = url;
  if ((url.toLowerCase().indexOf("http://") < 0) && (url.toLowerCase().indexOf("https://") < 0)) { url2 = 'http://' + url; }
  return url2;
}

function shortUrl(url) {
  var url2 = url;
  if (url.length > 130) { url2 = url.substr(0, 130) + '...'; }
  return url2;
}

function checkUserAuth(user, auth) {
  var conn = "inc/checkAuth2.php";
  var final = 'false';
  
  var xhr = new XMLHttpRequest();
  xhr.onreadystatechange = function() {
      if (xhr.readyState == 4) {
        if (xhr.status == 200) {
          var resp = JSON.parse(xhr.responseText);
          final = resp.result;
        }
      }
  }
  
  xhr.open("POST", conn, false);
  xhr.setRequestHeader("Content-type","application/x-www-form-urlencoded");
  xhr.send("user="+user+"&auth="+auth+"");
  
  return final;
}

function deleteClip(id) {
  var conn = "inc/deleteClip2.php";
  var final = false;
  
  var xhr = new XMLHttpRequest();
  xhr.onreadystatechange = function() {
      if (xhr.readyState == 4) {
        if (xhr.status == 200) {
          var resp = JSON.parse(xhr.responseText);
          final = resp.result;
        }
      }
  }
  
  xhr.open("POST", conn, false);
  xhr.setRequestHeader("Content-type","application/x-www-form-urlencoded");
  xhr.send("user="+user+"&id="+id+"");
  
  return final;
}