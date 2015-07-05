/*****************************************************************
 * Output screen
 *****************************************************************/
'use strict';

/**
 * Apply preview
 */
switch_action.action_output_setup = function action_output_setup() {
   set_text( '#action_output_btn_back', txt.action_output.btn_back );
   set_text( '#action_output_btn_restart', txt.action_output.btn_restart );
   _('#txt_output')[0].value = generate_output( bbc_builder );
   _('#txt_output')[0].focus();
   _('#txt_output')[0].select();
};

/**
 * Clean up preview
 */
switch_action.action_output_cleanup = function action_output_cleanup() {
   _('#txt_output')[0].value = '';
};


/**
 * Build output from log variable, coloutList variable, and from builder parameter
 */
function generate_output( builder ) {
   var result = '';
   var leadingUnnamed = true;
   var colourList = options.colourList;

   if ( builder.open )  result += builder.open();

   log.forEach( function( line ) {
      if ( ! line.match( /\b(ChanServ|NickServ)\b/i ) ) {
        line = line.trim();

        var buffer = '';
        var actor = '';
        var index = line.length;
        // Determine actor of this line
        nameList.forEach( function( name ) {
          var pos = line.indexOf( name );
          if ( pos >= 0 && pos < index ) {
             actor = name;
             index = pos;
          }
        } );

        // Call builder tp
        var tmp = line.match( datePattern );
        if ( actor ) {

           // As soon as we found a name, unnamed leading part ends
           leadingUnnamed = false;

           // Start building line
           if ( builder.mark ) builder.mark();
           var dateLen = 0;
           if ( tmp ) {
              tmp = tmp[0];
              buffer += builder.build_line( 'silver', tmp );
              dateLen = tmp.length;
           }
           if ( actor ) {
              var tmp2 = line.substr( dateLen, index-dateLen+actor.length+1 );
              // Discard lines start with .r .roll .rh .here etc.
              if ( line.substr( dateLen + tmp2.length ).match( /^\s*\.\w\s+[d\d]/ ) ) {
                 if ( builder.reset ) builder.reset();
                 buffer = "";
              } else {
                 if ( actor && colourList[actor] && colourList[actor].colour ) {
                    // Coloured, output coloured line
                    var nameColour = colourList[actor].name ? colourList[actor].name : colourList[actor].colour;
                    buffer += builder.build_line( nameColour, tmp2 );
                    buffer += builder.build_line( colourList[actor].colour, line.substr( dateLen + tmp2.length ) );
                 } else {
                    // No colour, output normal line
                    buffer += builder.build_line( colourList[actor].name, line.substr( dateLen ) );
                 }
              }
           } else {
              // No actor, output normal line
              buffer += builder.build_line( null, line.substr( dateLen ) );
           }
        } else {
           // If still in leading section and we're set to output this section,
           // of if we're set to output all unnamed section, build this line
           if ( leadingUnnamed && options.preserveLeadingUnnamedLines || !options.discardUnnamedLines ) {
              if ( tmp ) {
                 buffer = builder.build_line( 'silver', tmp[0] );
                 buffer += builder.build_line( '', line.substr( tmp[0].length ) );
              } else {
                 buffer = builder.build_line( '', line );
              }
           }
        }

        // If line is valid, append to buffer
        if ( buffer ) {
           buffer += "\n";
           result += buffer;
        }
      }
   } );

   if ( builder.close )  result += builder.close();

   return result;
}


/**
 * Build line in HTML
 */
var html_builder = {
   build_line: function generate_html( colour, text ) {
      if ( ! text ) return "";
      text = IrcToText( text );
      if ( ! colour ) return esc_html( text );
      var span = document.createElement('span');
      span.style.color = colour;
      span.appendChild( document.createTextNode( text ) );
      return span.outerHTML;
   }
}

/**
 * Build line in BBCode
 */
var bbc_builder = {
  last_colour : '',
  mark_colour : '',

  open : function generate_bbc_open() {
     this.last_colour = '';
     return "";
  },

  mark: function generate_bbc_mark() {
     this.mark_colour = this.last_colour;
  },

  reset: function generate_bbc_reset() {
     this.last_colour = this.mark_colour;
  },

  build_line: function generate_bbc( colour, text ) {
     if ( ! text ) return "";
     colour = colour.trim();
     text = IrcToText( text );
     if ( this.last_colour !== colour ) {
        text = ( this.last_colour ? "[/color]" : "" ) + ( colour ? "[color="+colour+"]" : "" ) + text;
     }
     this.last_colour = colour;
     return text;
  },

  close: function generate_bbc_close() {
     return this.last_colour ? "[/color]" : "";
  }
};