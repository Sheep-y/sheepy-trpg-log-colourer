/*****************************************************************
 * Preview screen
 *****************************************************************/
'use strict';

/**
 * Apply preview
 */
switch_action.action_preview_setup = function action_preview_setup() {
   set_text( '#action_preview_btn_back', txt.action_preview.btn_back );
   set_text( '#action_preview_btn_next', txt.action_preview.btn_next );
   _('#pre_preview')[0].innerHTML = generate_output( html_builder );
   _('#pre_preview')[0].setAttribute( 'style', options.previewStyle );
};

/**
 * Clean up preview
 */
switch_action.action_preview_cleanup = function action_preview_cleanup() {
   _('#pre_preview')[0].innerHTML = '';
};