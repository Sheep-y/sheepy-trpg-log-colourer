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

function is_qq( text ) {
   var log = text.split( '\n' );
   var lineCount = Math.min( log.length, 100 );
   var hit = 0;
   for ( var i = 0 ; i < lineCount ; i++ ) {
      var line = log[i];
      if ( line.match( QqToIRC.datePattern ) ) ++hit;
   }
   return hit > lineCount * 0.4;
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

/**
 * Convert QQ log which has two lines per message into IRC log.
 */
function QqToIRC ( text ) {
   var lines = text.replace( /\r/g, '' ).split( '\n' );
   var lastMatch = null, pattern = QqToIRC.datePattern, date = /^(19|20|21)\d{2}-[0123]\d-[0123]\d$/;
   var result = '';
   for ( var i = 0, len = lines.length ; i < len ; i++ ) {
      var line = lines[ i ];
      if ( ! line ) continue; // Empty line (image)
      line = line.trim();

      // Date lines are outputted as is
      if ( line.match( date ) ) {
         result += line + '\n';
         continue;
      }

      var match = line.match( pattern );
      // Set name and time for speaker line
      if ( match )
         lastMatch = match;
      // Convert to message line for message following speaker
      else if ( lastMatch )
         if ( line.startsWith( '/me ' ) )
            result += '[' + lastMatch[2] + '] * ' + lastMatch[1] + ' ' + line.substr( 4 ) + '\n';
         else
            result += '[' + lastMatch[2] + '] ' + lastMatch[1] + ': ' + line + '\n';
   }
   return result.trim();
}
QqToIRC.datePattern = /(.+)\(\d+\) (\d\d?:\d\d:\d\d)\s*(?:\r?\n|$)/; // QQ log date pattern