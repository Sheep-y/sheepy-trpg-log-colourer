'use-strict';

txt.zh = {
  title: 'Sheepy 的聊天記錄上色器 v2 Alpha 7',
  err_upgrade: '請升級瀏覽器',
  err_noFileAPI: '你的瀏覽器不支援 File API，不能讀取檔案',
  action_input: {
     lbl_input   : '請貼上記錄內文',
     lbl_parsing : '偵察名字中...',
     lbl_parsed  : '參與者: ',
     pnl_dnd    : '拖放記錄檔到此',
     lnk_bug    : '報錯',
     lnk_toIrc  : '轉成 mIRC',
     lnk_toTxt  : '轉成純文字',
     lnk_toZhant: '轉成正體',
     lnk_toZhans: '轉成簡體',
     btn_output : '輸出 ✔',
     btn_next   : '上色 ⇨',
     err_nolog : '請先輸入記錄。',
     err_date  : '無法解析日期時間。',
     err_parse : '無法解析名字。',
     err_noname: '無法認出參與者，不能繼續。'
  },
  action_colour: {
     chk_perserveOriginal: '保留原色彩',
     btn_reset : '重設成預設',
     btn_back  : '⇦ 輸入',
     btn_next  : '預覽 ⇨',
  },
  action_preview: {
     btn_back  : '⇦ 上色',
     btn_next  : '輸出 ✔',
  },
  action_output: {
     btn_back    : '⇦ 預覽',
     btn_restart : '⇚ 重新開始',
  },
  action_about: {
     btn_back    : '⇦ 返回',
     btn_email   : '電郵',
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
      '同名字'  , '(不上色)','深橙色', '橙色'  ,
      '橄欖色'  , '綠色'   , '青綠色', '淺藍色',
      '藍色'    , '藍祡色' , '祡色'  , '深紫紅',
      '紅色'    , '粉紅色' , '黃色'  , '淺綠色',
      '淺青綠色', '珊瑚色' , '黑色'  , '深灰色',
      '灰色'    , '淺灰色' , '白色'
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