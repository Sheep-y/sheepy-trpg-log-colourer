"use strict";

var defaultOptions = {
  version: 20120821,
  datePattern: '',
  nameTerminator: '',
  namePositionMax: 30,
  previewStyle: 'padding: 1em ; background-color:#D9EFF9; background-image: linear-gradiant(to bottom, #E2F4FB, #D1EAF7);',
  perserveOriginal: true,
  perserveOriginalBoundary: 1,
  perserveOriginalIfBackground: true,
  discardUnnamedLines: true,
  preserveLeadingUnnamedLines: true,
  colourList: {}
};
var options = {};
var txt = {};

/**
 * Switch between actions. Would find and call action_{$page}_cleanup for current page and action_{$page}_setup for next page.
 */
function switch_action(page) {
   if ( page == currentPage ) return;

   set_message('');

   // Pre-switch validation & cleanup
   var func = 'action_' + currentPage + '_cleanup';
   if ( switch_action[func] && switch_action[func]( page ) === false ) return;

   Array.prototype.forEach.call(_("body > div[id]"), function(e){ e.style.display = 'none'; });
   _("#action_"+page)[0].style.display = 'block';

   // Post-switch setup
   func = 'action_' + page + '_setup';
   if ( switch_action[func] ) switch_action[func]( page );

   lastPage = currentPage;
   currentPage = page;
}