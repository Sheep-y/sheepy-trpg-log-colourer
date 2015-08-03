/*****************************************************************
 * Input screen and date + name parsing
 *****************************************************************/
'use strict';

var timer_checkInput = 0;
var lastLog = null;

/**
 * Setup timer that monitors input change
 */
switch_action.action_input_setup = function action_input_setup() {
   set_text( '#dnd' , txt.action_input.pnl_dnd  );
   set_text( '#action_input_lnk_bug', txt.action_input.lnk_bug );
   set_text( '#action_input_lnk_irc', '' );
   set_text( '#action_input_lnk_txt', '' );
   set_text( '#action_input_lnk_qq' , '' );
   set_text( '#action_input_lnk_zhant', window.convertToTraditional ? txt.action_input.lnk_toZhant : '' );
   set_text( '#action_input_lnk_zhans', window.convertToSimplified ? txt.action_input.lnk_toZhans : '' );
   set_text( '#action_input_btn_output', txt.action_input.btn_output );
   set_text( '#action_input_btn_next' , txt.action_input.btn_next  );
   function timer_onCheckInput() {
      var log = _('#txt_input')[0].value.trim();
      if ( log !== lastLog ) {
         lastLog = log;
         parse_input();
      }
   }
   timer_onCheckInput();
   timer_checkInput = setInterval( timer_onCheckInput, 500 );
   _('#txt_input')[0].focus();
}

/**
 * Check status and clear timer that monitors input change
 */
switch_action.action_input_cleanup = function action_input_cleanup( page ) {
   if ( page != 'about' ) {
      if ( log.length <= 1 ) {
         alert( txt.action_input.err_nolog );
         return false;
      }
      if ( nameList.length <= 0 ) {
         alert( txt.action_input.err_noname );
         return false;
      }
   }
   if ( timer_checkInput ) {
      clearInterval(timer_checkInput);
      timer_checkInput = 0;
   }
   colours_fill();
}

function dragdrop_setEffect(evt, eft) {
   evt.preventDefault(); // So that browser won't open the file
   try {
      evt.dataTransfer.dropEffect = evt.dataTransfer.effectAllowed = eft
   } catch ( ignored ) {}
   return false;
}
function dragdrop_check( evt ) {
   //if ( !evt.dataTransfer.effectAllowed.match( /copy|all/i ) ) return;
   var index = Array.prototype.indexOf;
   var mime = ['Files', 'text/plain', 'text/html'];
   var data = evt.dataTransfer;
   if ( data.types ) {
      for ( var i in mime ) {
         if ( index.call( data.types, mime[i] ) >= 0 ) {
            return dragdrop_setEffect(evt, "copy");;
         }
      }
   } else if ( data.files && data.files.length ) {
      return dragdrop_setEffect(evt, "copy");
   } else if ( data.getData("Text") || data.getData("URL") ) {
      return dragdrop_setEffect(evt, "copy");
   }
   return dragdrop_setEffect(evt, "none");
}
function dragdrop_ok( evt, data ) {
   if ( evt ) {
      evt.preventDefault();
      dragdrop_hide( evt );
   }
   if ( data ) {
      document.getElementById('txt_input').value = data;
      parse_input();
   }
   return false;
}
function dragdrop_drop( evt ) {
   var data;
   // Try to load data as files
   if ( evt.dataTransfer.files && evt.dataTransfer.files.length ) {
      if ( ! window.FileReader ) {
         alert( txt.err_noFileAPI );
         return dragdrop_ok( evt, null );
      }
      var reader = new FileReader();
      reader.onload = function(evt) {
         var result = evt.target.result;
         if ( is_html( result ) ) result = HtmlToIrc( result );
         dragdrop_ok( null, result );
      };
      reader.readAsText( evt.dataTransfer.files[0] );
      return dragdrop_ok( evt, null );
   }
   // Try to get data as text
   try {
      data = evt.dataTransfer.getData('Text');
      if ( !data ) data = evt.dataTransfer.getData('text/plain');
      if ( !data ) data = evt.dataTransfer.getData('text/html');
      if ( data ) return dragdrop_ok( evt, data );
   } catch ( ignored ) {}
   // Try to get data as link
   try {
      data = evt.dataTransfer.getData('URL');
      var req = new XMLHttpRequest();
      req.onreadystatechange = function(evt) {
         if (httpRequest.readyState === 4) {
            var result = req.responseText;
            if ( is_html( result ) ) result = HtmlToIrc( result );
            dragdrop_ok( null, result );
         }
      };
      httpRequest.open('GET', data);
      httpRequest.send();
      return dragdrop_ok( evt, null );
   } catch ( ignored ) {}
   return dragdrop_ok( evt, null );
}
function dragdrop_show( evt ) {
   var data = evt.dataTransfer;
   if ( data.files || data.types || data.getData("Text") || data.getData("URL") ) {
      _('#dnd')[0].style.display = 'block';
   }
}
function dragdrop_hide( evt ) { _('#dnd')[0].style.display = '';      }

/**
 * Run given function on input area and update it with result.
 */
function convertText( func ) {
   document.getElementById('txt_input').value = func( document.getElementById('txt_input').value );
}

/**
 * Pre-Process log and then analyse date pattern
 */
function parse_input() {
   datePattern = nameBoundary = null;
   nameList = [];

   var input = document.getElementById('txt_input').value.replace( /\r/g, '' ).trim();
   log = input.split(/\n/g);
   if ( log.length > 1 ) {
      // Show to text link if input seems to be html
      set_text( '#action_input_lnk_irc', '' );
      set_text( '#action_input_lnk_txt', '' );
      set_text( '#action_input_lnk_qq' , '' );
      if ( is_html( input ) ) {
         set_text( '#action_input_lnk_irc', txt.action_input.lnk_toIrc );
      } else if ( is_mirc( input ) ) {
         set_text( '#action_input_lnk_txt', txt.action_input.lnk_toTxt );
      } else if ( is_qq( input ) ) {
         set_text( '#action_input_lnk_qq' , txt.action_input.lnk_toIrc );
      }

      // Identify date and names - the variable part surrounded by fixed prefix and postfix pattern
      set_message( txt.action_input.lbl_parsing );
      parse_date();
      parse_name();

      if ( nameList.length > 0 ) {
         set_message( txt.action_input.lbl_parsed + nameList.concat().reverse().join(', ') );
      } else {
         set_message( datePattern === null ? txt.action_input.err_date : txt.action_input.err_parse );
      }
   } else {
      set_message( '' );
      set_text( '#action_input_lnk_txt', '' );
   }
}

/**
 * Parse date pattern from log
 */
function parse_date () {
   // List of candidate patterns for date
   var candidates = []; // [ { pattern: genPattern( log[0] ), text: log[0], count: 0 } ];
   // Number of lines we are scanning
   var lineCount = Math.min( log.length, 500 );

   // Generate a date pattern from given string.
   function genPattern(txt) {
      return new RegExp( "^" + esc_regx(txt).replace( /\d{1,2}/g, '\\d{1,2}' ).replace( /am|pm|nn/g, '(am|pm)' ).replace( /AM|PM|NN/g, '(AM|PM)' ).replace( /上午|下午|中午/g, '[上下中]午' ) );
   }
   // Create a new pattern from given line
   function createPattern(i,txt) {
      var newPattern = { pattern: genPattern(txt), text: txt, count: 1 };
      candidates.unshift( newPattern );
      for ( var k = 0 ; k < i ; k++ ) {
         if ( log[k].match( newPattern.pattern ) ) ++newPattern.count;
      }
   }

   // Scan the lines
   for ( var i = 0 ; i < lineCount ; i++ ) {
      var line = log[i];
      var found = false;

      if ( line.trim() === "" ) continue;

      // Scan throgh the candidates
      candidates.forEach( function( e ) {
         if ( line.match( e.pattern ) ) {
            ++e.count;
            found = true;
         }
      } );

      // If no match, find a new one from shortest match
      // TODO: Reverse search to left-to-right to improve performance!
      if ( ! found && candidates.length > 0 ) {
         // Loop through all candidates we have
         for ( var j = 0 ; j < candidates.length ; j++ ) {
            // Remove characters one by one until we found a match
            var tmp = candidates[j].text;
            do {
               tmp = tmp.substr( 0, tmp.length-1 );
               // If a match is found then use it as new pattern
               if ( line.match( genPattern( tmp ) ) ) {
                  createPattern( i, tmp );
                  found = true;
               }
            } while ( tmp.length > 5 && ! found );
            if ( found ) break;
         }
      }

      // If still no match, create a new pattern with this line
      if ( ! found && line.length > 5 ) createPattern( i, line );
   } // for ( var i = 0 ; i < lineCount ; i++ ) {

   // After the lines are scanned, find candidate pattern with highest hit rate.
   if ( candidates.length ) {
      var highest = candidates[0];
      for ( var i = candidates.length -1 ; i > 0 ; i-- ) {
         if ( candidates[i].count > highest.count ) {
            highest = candidates[i];
         } else if ( candidates[i].count === highest.count && candidates[i].text.length > highest.text.length ) {
            highest = candidates[i];
         }
      }
      if ( highest.count >= Math.min( lineCount-1, Math.floor( lineCount*0.95) ) ) {
        datePattern = highest.pattern;
      }
   }
}

/**
 * Parse name pattern from log
 */
function parse_name() {
   // Initialisation
   function find_pattern( proprocess ) {
      var candidates = []; // [ { boundary: /:/, count: 0, nameCount: 0, names: { 'name1': 3 , 'name2': 5 } ] ]
      var special_char = ':]>"\'\t ：］＞　';
      var pattern_count = special_char.length;
      for ( var i = 0 ; i < pattern_count ; i++ ) {
        candidates.push( { boundary: special_char.charAt(i), count: 0, nameCount: 0, names: {} } );
      }

      // Test each boundary on each line of log
      var lineCount = log.length;
      var validLines = 0;
      for ( var i = 0 ; i < lineCount ; i++ ) {
         // Get first part of this line (exlucding date)
         var line = datePattern ? log[i].replace( datePattern, '' ) : log[i];
         // Filter away chanserv / nickserv message and lines without date, then run preprocess and check result
         if ( line.length <= 0 || line.match( /\b(ChanServ|NickServ)\b/i ) ) continue;
         var trimmedLine = proprocess( line.trim().substr( 0, options.namePositionMax ) );
         if ( !trimmedLine ) continue;

         // Remove leading * and start looping through candidates
         trimmedLine = trimmedLine.replace( /^\*+/, '' );
         ++validLines;

         for ( var j = 0 ; j < pattern_count ; j++ ) {
            // Skip action lines for more accurate detection
            var c = candidates[j];
            var tmp = trimmedLine.substr( 1 ).match( c.boundary );
            if ( ! tmp ) continue;

            tmp = trimmedLine.substr( 0, tmp.index+1 ).trim();
            if ( tmp && tmp.indexOf(' ') < 0 && tmp.indexOf('#') < 0 ) {
               ++c.count;
               var namelist = c.names;
               if ( namelist[tmp] ) {
                  ++namelist[tmp];
               } else {
                  ++c.nameCount;
                  namelist[tmp] = 1;
               }
            }
         }

         // After 64 valid lines, remove characters with fewer then 8 hits to speed up scanning
         if ( validLines == 64 ) {
            for ( var j = pattern_count-1 ; j >= 0 ; j-- ) {
               if ( candidates[j].count < 8 ) {
                  candidates.splice(j, 1);
                  --pattern_count;
               }
            }
            if ( pattern_count <= 0 ) break;
         }
      }

      // With the candidates, try to find the best fit
      if ( pattern_count > 0 ) {
         var bestBoundary = candidates[0];
         for ( var j = 1 ; j < pattern_count ; j++ ) {
            var c = candidates[j];
            // Find boundary with highest line ratio
            if ( bestBoundary.count <= 0 || ( c.count / c.nameCount ) > ( bestBoundary.count / bestBoundary.nameCount ) ) {
               bestBoundary = c;
            }
         }
         var names = [];
         for ( var name in bestBoundary.names ) {
            if ( name !== "" ) names.push( name.replace(/^[<(\[]/, '').replace( /\d+$/, '' ).trim() );
         }
         return names;
      }
   }

   /**
    * Sort by reverse text length, then by text content.
    * Sorting in reverse make sure that longer names are detected first
    */
   function rev_length_sort(a, b) {
      var dl = b.length - a.length;
      if ( dl != 0 ) return dl;
      return a < b ? 1 : -1;
   }

   // Parse names from normal lines
   var a = find_pattern( function(line){ return line.indexOf('*') === 0 ? null : line } );
   // Parse names from action lines (lines starting with *)
   a = a.concat( find_pattern( function(line){ return line.indexOf('*') !== 0 ? null : line } ) );
   // remove duplicates then sort by reverse length
   nameList = a.filter( function(e,i){ return e !== "" && a.indexOf(e) === i } );
   nameList.sort( rev_length_sort );
}