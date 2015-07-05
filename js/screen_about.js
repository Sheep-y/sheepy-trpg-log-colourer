/*****************************************************************
 * About screen
 *****************************************************************/
'use strict';

switch_action.action_about_setup = function action_input_setup() {
   set_text( '#action_about_btn_back' , txt.action_about.btn_back );
   set_text( '#action_about_btn_email', txt.action_about.btn_email  );
};

switch_action.action_about_cleanup = function action_input_cleanup() {
   setTimeout( function() {
      // After screen is switched, remove style so that css animation would reset
      document.getElementById('action_about').removeAttribute( 'style' );
   });
};