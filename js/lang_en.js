'use-strict';

txt.en = {
  title: 'Chat Log Colourer v2 Alpha 7 by Sheepy</a>',
  err_upgrade: 'Please upgrade browser',
  err_noFileAPI: 'Your browser doesn\'t support File API, cannot read from file',
  action_input: {
     lbl_input   : 'Paste log text here',
     lbl_parsing : 'Detecting names...',
     lbl_parsed  : 'People: ',
     pnl_dnd    : 'Drop log file here',
     lnk_bug    : 'Bug Report',
     lnk_toIrc  : 'To mIRC',
     lnk_toTxt  : 'To Plain Text',
     lnk_toZhant: '',
     lnk_toZhans: '',
     btn_output : 'Output ✔',
     btn_next   : 'Colouring ⇨',
     err_nolog : 'Please input log first.',
     err_date  : 'Cannot parse date time.',
     err_parse : 'Cannot parse names.',
     err_noname: 'Cannot progress without identifying speakers.'
  },
  action_colour: {
     chk_perserveOriginal: 'Perserve original colours',
     btn_reset : 'Reset to default',
     btn_back  : '⇦ Input',
     btn_next  : 'Preview ⇨',
  },
  action_preview: {
     btn_back  : '⇦ Colouring',
     btn_next  : 'Output ✔',
  },
  action_output: {
     btn_back    : '⇦ Preview',
     btn_restart : '⇚ Restart',
  },
  action_about: {
     btn_back    : '⇦ Back',
     btn_email   : 'Email',
  },
  colour: {
    colours: [
      ''       , ' '      , '#C50'   , 'orange' ,
      'olive'  , 'green'  , 'teal'   , 'blue'   ,
      'navy'   , '#50C'   , 'purple' , 'maroon' ,
      'red'    , 'fuchsia', 'yellow' , 'lime'   ,
      'aqua'   , '#F88'   , 'black'  , '#333'   ,
      'gray'   , 'silver' , 'white'
    ],
    names: [
      'As name', '(None)' , 'Dare Orange', 'Orange'  ,
      'Olive'  , 'Green'  , 'Teal'   , 'Blue',
      'Navy'   , 'Indigo' , 'Purple' , 'Maroon',
      'Red'    , 'Fuchsia', 'Yellow' , 'Lime',
      'Aqua'   , 'Coreal' , 'Black'  , 'Light grey',
      'Grey'   , 'Silver' , 'White'
    ],
    auto: [
      '#C50'   ,
      'orange' ,
      'olive'  ,
      'green'  ,
      'teal'   ,
      'blue'   ,
      'navy'   ,
      '#50C'   ,
      'purple' ,
      'maroon' ,
      'fuchsia'
    ],
    dm: {
      name: 'silver',
      colour: 'red'
    },
    bot: {
      name: 'red',
      colour: ' '
    }
  }
};