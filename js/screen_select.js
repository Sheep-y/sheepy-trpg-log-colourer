/*****************************************************************
 * Colour selection screen
 *****************************************************************/
'use strict';

/**
 * Lost colour settings, setup colour select boxes, assign initial colours if necessary
 */
switch_action.action_colour_setup = function action_colour_setup() {
   set_text( '#action_colour_btn_back' , txt.action_colour.btn_back );
   set_text( '#action_colour_btn_next' , txt.action_colour.btn_next );
   set_text( '#action_colour_btn_reset', txt.action_colour.btn_reset );

   var list = _('#lst_colour')[0];
   var tbl = document.createElement( 'table' );
   var tby = document.createElement( 'tbody' );
   list.innerHTML = '';
   list.appendChild( tbl );
   tbl.appendChild( tby );
   nameList.forEach( function( name ) {
      var c = options.colourList[name];
      var tr = document.createElement( 'tr' );
      var td = document.createElement( 'td' );
      tby.appendChild( tr );
      td.appendChild( document.createTextNode( name ) )
      tr.appendChild( td );
      var td = document.createElement( 'td' );
      td.appendChild( create_colour_select( find_colour_index( c.name   ), false, function(value){ options.colourList[name].name   = value; colours_save(); } ) );
      tr.appendChild( td );
      var td = document.createElement( 'td' );
      td.appendChild( create_colour_select( find_colour_index( c.colour ), true , function(value){ options.colourList[name].colour = value; colours_save(); } ) );
      tr.appendChild( td );
   });
};

/**
 * Clean up select boxes and save colour settings
 */
switch_action.action_colour_cleanup = function action_colour_cleanup() {
   _('#lst_colour')[0].innerHTML = '';
   options_save();
};

/**
 * Reset colour list to default
 */
function reset_colour() {
   options.colourList = {};
   colours_fill();
   switch_action.action_colour_setup('colour');
}

/**
 * Load saved colours
 */
function options_load() {
   var data;
   if ( window.localStorage ) {
      data = localStorage.logColourerOptions;
   }
   if ( ! data && document.cookie ) {
      data = decodeURI( JSON.stringify( document.cookie ) );
   }

   options = {};
   if ( data ) {
      try {
         var tmp  = JSON.parse( data );
         if ( tmp.version === undefined ) {
            options = {};
         } else if ( tmp.version == 20120808 ) { // Prototype and Alpha
            options.colourList = tmp;
            delete option.colourList.version;
         } else {
            options = tmp;
         }
         if ( options.colourList === undefined ) options = {};
      } catch ( e ) {
         options = {};
         if ( window.console ) console.log( "Cannto read past colours from cookie: "+e );
      }
   }

   if ( options['colourList'] === undefined ) options['colourList'] = {};
   for ( var i in defaultOptions ) {
      if ( options[i] === undefined ) options[i] = defaultOptions[i];
   }
   colours_fill();
}

/**
 * Fill unset users with default colour
 */
function colours_fill() {
   var special_users;
   var colourList = options.colourList;
   if ( nameList ) {
      nameList.forEach( function( name ) {
         // If new name, try to determine whether his/her colour
         if ( ! colourList[name] ) {
            // Find DM and bots
            if ( special_users === undefined ) special_users = find_special_users();
            colourList[name] = {
               name: '',
               colour: '',
               select: null
            };

            if ( name === special_users.dm ) {
               // Game Master (the one who speak most)
               colourList[name] = {}
               for ( var prop in txt.colour.dm ) colourList[name][prop] = txt.colour.dm[prop];

            } else if ( special_users.bots.indexOf( name ) >= 0 ) {
               // Bots
               colourList[name] = {}
               for ( var prop in txt.colour.bot ) colourList[name][prop] = txt.colour.bot[prop];

            } else {
               // Normal users, pick colour from name hash
               var colour = name.charCodeAt(0);
               for ( var i = 1 ; i < name.length ; i++ ) colour = ( colour << 2 ) + name.charCodeAt(i);
               colourList[name].colour = txt.colour.auto[ colour % txt.colour.auto.length ];
            }
         }
      } );
   }
}

/**
 * Save current colours
 */
function options_save() {
   if ( window.localStorage ) {
      localStorage.logColourerOptions = JSON.stringify( options );
   } else {
      document.cookie = encodeURI( JSON.stringify( options ) );
   }
}

/**
 * Given a colour, find the index in colour select list
 */
function find_colour_index( colour ) {
   var result = txt.colour.colours.indexOf( colour );
   return result < 0 ? 1 : result;
}

/**
 * Find DM and dicebots
 */
function find_special_users() {
   var dm = nameList[0];
   var bots = [];
   var count = 0;
   nameList.forEach( function( name ) {
      // Detect robots
      var lc = name.toLowerCase();
      if ( lc === 'dicebot' || lc == 'dndbot' || name.match( /[a-z]Bot$/ ) ) {
         bots.push( name );
      } else {
        // Not bot; detect DM
        var hit = 0;
        var lastline = -2;
        log.forEach( function( line, i ) {
           var i = line.indexOf( name );
           if ( i >= 0 && i < options.namePositionMax ) {
              ++hit;
              if ( lastline == i+1 ) hit += 0.5; // Heavier weight to continuous lines
              lastline = i;
           }
        } );

        // If this one spoke more then current DM candidate, make it current DM candidate
        if ( hit > count ) {
           dm = name;
           count = hit;
        }
     }
   } );

   return { dm: dm, bots: bots };
}

/**
 * Create a colour selection box
 */
function create_colour_select( index, canBlank, onChange ) {

   // Create an <option> for a colour
   function create_colour_option( index ) {
      var opt = document.createElement('option');
      opt.setAttribute('value', txt.colour.colours[index] );
      opt.textContent = txt.colour.names[index]
      opt.style.color = txt.colour.colours[index]; // Bug: blank would use existing colour
      return opt;
   }

   // Create the select box
   var sel = document.createElement('select');
   var opt = create_colour_option( index );
   sel.appendChild( opt );
   sel.style.color = opt.style.color;

   // When clicked, expand colour option then remove this event handler
   function colour_select_onMouseDown ( event ) {
      // Insert colours before current option
      for ( var i = canBlank ? 0 : 1 ; i < index ; i++ ) {
         var co = create_colour_option( i );
         sel.insertBefore( co, opt );
      }
      // Insert colours after current option
      for ( var i = index+1 ; i < txt.colour.colours.length ; i++ ) {
         sel.appendChild( create_colour_option( i ) );
      }
      this.removeEventListener( 'mousedown', colour_select_onMouseDown, false );
   }
   sel.addEventListener( 'mousedown', colour_select_onMouseDown, false );

   // When changed, update select box's colour
   sel.addEventListener( 'change', function() {
      sel.style.color = sel.value;
      if ( onChange ) onChange( sel.value );
   }, false );

   return sel;
}