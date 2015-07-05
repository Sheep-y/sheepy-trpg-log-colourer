/**************************************/
/****** MAIN ROUTINE ******************/
/**************************************/
var currentPage = '';
var lastPage = '';

var datePattern;
var nameBoundary;
var nameList = [];
var log = [];

var lang = location.search.match( /[?&]lang=(\w+)($|&)/ );
if ( lang ) {
  lang = lang[1];
} else {
  lang = navigator.language || navigator.userLanguage;
}
if ( lang &&lang.match( /^zh(-.+)?$/ ) ) {
  txt = txt.zh;
  document.querySelector('.header').removeChild( document.querySelector('.lang.zh').parentNode );
} else {
  txt = txt.en;
  document.querySelector('.header').removeChild( document.querySelector('.lang.en').parentNode );
}

if ( !document.querySelectorAll || !"".trim || ![].filter ) {
   alert( txt.err_upgrade );
} else {
   window.addEventListener('DOMContentLoaded',function(){ switch_action('input'); },false);
   document.getElementById( 'header' ).innerHTML = txt.title;
   document.title = document.getElementById( 'header' ).textContent;
   document.getElementById('header_image').src = document.getElementById( 'icon' ).href;
   options_load();
}
document.querySelector( '#txt_input' ).placeholder = txt.action_input.lbl_input;