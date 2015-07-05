/*****************************************************************
 * Non-screen specific utilities and main routine
 *****************************************************************/
'use-strict';

/** Alias for document.querySelectorAll */
function _(css) { return document.querySelectorAll(css); }

/** Show text for given selectors */
function set_text( css, text ) {
   text = IrcToText( text );
   if ( ! text ) {
      Array.prototype.forEach.call( _(css), function(e){
         e.style.display = 'none';
      } );
   } else {
      Array.prototype.forEach.call( _(css), function(e){
         e.textContent = text;
         e.style.display = '';
      } );
   }
}

/** Show error message on every page */
function set_message( msg ) {
   set_text( '.lbl_message', msg );
}

/** Escape html as text */
function esc_html( text ) {
   if ( text && text.replace ) return text.replace( /&/g, '&amp;' ).replace ( /</g, '&lt;' );
   return text;
}

/** Escape special regx characters in text */
function esc_regx( text ) {
   return text.replace( /([-[\]{}()*+?.,\\^$|#])/g, '\\$1' );
}

function is_mirc( text ) {
   return text.match( IrcToText.pattern );
}

function is_html( text ) {
   return text.trim().match( /^<(!DOCTYPE|html)\b/i ) ? true : false;
}

/** Convert HTML to mIRC code */
function HtmlToIrc(text) {
  var match = text.match( /<body[^>]*>([\s\S]*)(?:<\/body|$)/i );
  if ( match ) {
     var elem = document.createElement('div');
     var html = match[1].trim();
     // Remove line breaks
     html = html.replace( /\r|\n/g, ' ' ).replace( />\s+</g, '><' ).replace( /\s+/g, ' ' );
     // Extract colour code
     html = html.replace( /(style="(?:)"[^<>]*>)/g, '$1');
     // Re-add line breaks
     html = html.replace( /((?:<\/(tr|table|div|p|li)\s*>|<[hb]r\s*\/?>)+)/g, '$1\n' );
     elem.innerHTML = html;
     return elem.textContent;
  }
  return text;
}

/** Remove mIRC code to make plain text */
function IrcToText(text) {
  return text.replace( IrcToText.pattern, '' );
}
IrcToText.pattern = /(\x03+(\d\d?|##?[a-z0-9-]+#)(,(\d\d?|##?[a-z0-9-]+#))?|\x02|\x16|\x1F|\x1D)+/g;