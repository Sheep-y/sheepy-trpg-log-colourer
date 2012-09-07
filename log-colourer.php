<?php /*?><!DOCTYPE HTML><html><head><title>501 Not Implemented</title><meta http-equiv="Content-Type" content="text/html; charset=utf-8"></head><body><p>

>>> 此程序需要使用支援 PHP 的伺服器來執行. 請考慮直接使用<a href='http://www.ellesime.net/~sheepy/tools/log-colourer.php'>在線版</a>  <<<

</p></body></html><div style='display:none'>*/

@include('compat.php'); // Compiled PEAR compat library, not needed on PHP 5

if (!empty($_GET['get_source'])) {
  echo '<meta http-equiv="Content-Type" content="text/html; charset=utf-8">';
  if (@$_GET['lib'] == 'compat')
    highlight_file('compat.php');
  else
    highlight_file(end(explode('/', $_SERVER['SCRIPT_FILENAME'])));
  return;
}

//<!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN" "http://www.w3.org/TR/html4/loose.dtd">
?><html><head>
<title>IRC Log 上色器</title>
<meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
<style type="text/css">a{text-decoration:none} a:hover{text-decoration:underline}</style>
</head><body>
<form action='<?php echo $_SERVER['SCRIPT_NAME'];?>' method="post" enctype="multipart/form-data" id='form'>

<span style='float: right'>v1.2 <a href='?get_source=true' target='_blank'>上色器源碼</a><br/>
<a href='?get_source=true&amp;lib=compat' target='_blank'>(程序庫)</a> <a href='../img/_clipboard.swf' target='_blank'>(Flash 複制器)</a></span>
<h1><a href='http://www.ellesime.net/~sheepy/'>Sheepy</a> 的<a href='http://www.ellesime.net/~sheepy/tools/log-colourer.php'>在線 IRC 記錄上色器</a></h1>

<?php

if (function_exists('date_default_timezone_set'))
  date_default_timezone_set('Asia/Hong_Kong');
else
	ini_set('date.timezone', 'Asia/Hong_Kong');
if (@get_magic_quotes_gpc()) {
  /** Strip slash on all array element.  Not reference safe.  Accept string as input*/
  function stripslashes_deep($param) {
    if (is_array($param)) {
      $result = array();
      foreach ($param as $k=>$v)
        $result[$k] = is_string($v) ? stripslashes($v) : (is_array($v) ? stripslashes_deep($v) : $v);
      return $result;
    } else
      return is_string($param) ? stripslashes($param) : $param;
  }
  $_REQUEST = array_map('stripslashes_deep', $_REQUEST);
  $_GET = array_map('stripslashes_deep', $_GET);
  $_POST = array_map('stripslashes_deep', $_POST);
  $_COOKIE = array_map('stripslashes_deep', $_COOKIE);
}


// Find actor from matching line
function findName($matches) {
  reset($matches);
  next($matches);
  $name = next($matches);
  while (!$name && $name !== false) $name = next($matches);
  return $name;
}


/********************************************* 1ST STEP ******************************************/
/********************************************* 1ST STEP ******************************************/
if (!isset($_REQUEST['plog']) && !isset($_REQUEST['file'])) {
  // No input, show initial form
?>

<h2>第一步: 上載  <span style='color:lightgrey'>&gt; 上色 &gt; 完成</span></h2>

  <table>
    <tr><td valign='top'><label for='plog'>黏貼記錄</label></td><td>
      <textarea rows='10' cols='80' name='plog' id='plog' onkeyup='document.getElementById("log").disabled=document.getElementById("charset").disabled=this.value!=""'></textarea></td></tr>

    <tr><td>　　或</td><td>&nbsp;</td></tr>

    <tr><td valign='top'><label for='log'>上載記錄檔</label></td><td><input type='file' name='log' id='log'/>
    <!-- </td></tr>
    <tr><td><label for='charset'>編碼</label></td><td><select name='charset' id='charset'>
-->
    &nbsp; <label for='charset'>編碼</label> <select name='charset' id='charset'>
      <option value='gbk'>GBK</option>
      <option value='big5'>Big-5</option>
      <option value=''>UTF-8</option>
      <option value=''>ASCII</option>
    </select> 記事本等留下的 UTF-8 BOM 標記會被自動辨認 </td></tr>

    <tr><td colspan='2'>&nbsp;</td></tr>

    <tr><td><label for='regx_drop'>丟棄<a href='http://hk.php.net/reference.pcre.pattern.syntax' target='_blank'>表逹式</a></label></td>
      <td><input type='text' name='regx_drop' id='regx_drop' size='50' value='~^[&lt;\[].{5}[&gt;\]] ((\*{3}|\S+ +\.[rdRD]|\* 新加入:|\* 已退出:|\* \S+ 设置模式为:) |.+(\S+ 现已将其昵称改为 \S+| 已经连接到你所在的irc服务器了\.| 目前在 IRC| 已离开了 IRC|在#\S+叫我名字了。|\.IP 向你开小窗)$)~S'/>
     符合的行會被整行消滅，預設除去頻道活動及投骰動作</td></tr>
    <tr><td><label for='regx_name'>人名表逹式</label></td>
      <td><input type='text' name='regx_name' id='regx_name' size='50' value='~^([&lt;\[].{5}[&gt;\]]\s+)(?:[&lt;\[](.+?)[&gt;\]]|\*\s(.+?)\s|(.+?)(?:\s|\:|：))~S'/>
      偵察到的的行會依人名加上自選色彩；首組是時間，次組是人名</td></tr>

    <tr><td></td><td>以上表逹式如有缺失將可能導致刪行或上色的錯誤，請連同出錯部份<a href='http://www.ellesime.net/bbs/index.php?showtopic=17378' target='_blank'>到此報告</a></td></tr>
    <tr><td></td><td><label><input type='checkbox' name='act' value='1'> 動作與說話分開上色?</label></td></tr>
    <tr><td colspan='2'>&nbsp;</td></tr>

    <tr><td>上色方法</td>
      <td><label><input type='radio' name='colour_type' value='full' checked='checked' onclick='document.getElementById("regx_name").disabled=false' /> 漂亮上色
      　時間不上色，人名獨立上色，說話及動作也上色</label></td></tr>

    <tr><td></td>
      <td><label><input type='radio' name='colour_type' value='norm' onclick='document.getElementById("regx_name").disabled=false' /> 正常上色
      　時間和人名不上色，說話及動作上色</label></td></tr>

    <tr><td></td>
      <td><label><input type='radio' name='colour_type' value='block' onclick='document.getElementById("regx_name").disabled=false' /> 整段上色
      　同一人說話的多行會整段上同一顏色，包括時間；通常能大幅減少上色指令，減低字數超標的機會</label></td></tr>

    <!--tr><td></td>
      <td><label><input type='radio' name='colour_type' value='mirc' onclick='document.getElementById("regx_name").disabled=true'/> mIRC上色
      　不選色, 轉換 mIRC 色彩碼為 BBC 碼, 背景色不予保留</label></td></tr-->

    <tr><td colspan='2'>&nbsp;</td></tr>

<?php
/********************************************* 2ND STEP ******************************************/
/********************************************* 2ND STEP ******************************************/
} else if (isset($_REQUEST['plog'])) {

  // Get data
  if ($_REQUEST['plog']) { // Paste input
    $data = trim($_REQUEST['plog']);
    if (!$data) die('錯誤：沒有可以處理的資料，請返回上一步重試。');
    $_REQUEST['charset'] = '';

  } else if (isset($_FILES['log'])) { // Upload input
    $data = trim(file_get_contents($_FILES['log']['tmp_name']));
    if (!$data) die('錯誤：沒有可以處理的資料，請返回上一步重試。');
    if (strlen($data) >= 3 && $data[0] == chr(239) && $data[1] == chr(187) && $data[2] == chr(191)) {
      $data = substr($data, 3);
      $_REQUEST['charset'] = '';
    }
    if ($_REQUEST['charset']) {
      $data = iconv($_REQUEST['charset'], 'utf-8', $data);
    }
    if (strlen($data) < filesize($_FILES['log']['tmp_name'])/4)
      die('錯誤：轉碼後的大小相差太遠。編碼選擇錯誤或上載了錯誤的檔案？請返回上一步重試。');
  }

  // Parse name
  $data = explode("\n", $data);
  $result = $matches = array();
  $new_data = array();
  $colour_type = $_REQUEST['colour_type'];
  $regx_name = $_REQUEST['regx_name'];
  $regx_drop = $_REQUEST['regx_drop'];
  foreach ($data as $k => $line) {
    $line = trim($line);
    if (!$line) {
      $new_data[] = '';
    } else if ($regx_drop && preg_match($regx_drop, $line)) {
      continue;
    } else if (preg_match($regx_name, $line, $matches)) {
      if ($name = findName($matches)) $result[$name] = true;
      $new_data[] = $line;
    } else {
      $new_data[] = $line;
    }
  }

  if (!$result) die('找不到人上色喔... 表逹式或編碼有錯？請返回上一步重試。');

  // Save compressed hashed file
  $stream = bzcompress($data = implode("\n", $new_data));
  $hash = sha1($stream);
  $filename = "logs/$_SERVER[REMOTE_ADDR]__".date('Y-m-d\Th\hi\ms\s')."__$hash.txt.bz2";
  // Delete old file, if any
  if ($old_log = reset(glob("logs/$_SERVER[REMOTE_ADDR]__*__$hash.*")))
    unlink($old_log);
  if (file_put_contents($filename, $stream) === false) die('錯誤：無法儲存已作初步處理的記錄。請返回上一步重試。');

  function colour_picker($name, $char, $option = false) {
    return "<select onchange=\"document.getElementById('$name$char').value=this.style.backgroundColor=this.value\">\n".
    ($option=='full'?"<option value='\"' style='background-color:white;color:black'>(同人名)</option>\n":'').
    "<option value='' style='background-color:white;color:black'>(不上色或自定)</option>\n".
    "<option value='#C50' style='background-color:#C50;color:#C50' >深橙色</option>\n".
    "<option value='orange' style='background-color:orange;color:orange' >橙色</option>\n".
    "<option value='olive' style='background-color:olive;color:olive'>橄欖色</option>\n".
    "<option value='green' style='background-color:green;color:green' >綠色</option>\n".
    "<option value='teal' style='background-color:teal;color:teal' >青綠色</option>\n".
    "<option value='blue' style='background-color:blue;color:blue' >淺藍色</option>\n".
    "<option value='navy' style='background-color:navy;color:navy' >藍色</option>\n".
    "<option value='#50C' style='background-color:#50C;color:#50C' >藍祡色</option>\n".
    "<option value='purple' style='background-color:purple;color:purple' ".($option=='purple'?'selected':'')." >祡色</option>\n".
    "<option value='maroon' style='background-color:maroon;color:maroon' >深紫紅</option>\n".
    "<option value='red' style='background-color:red;color:red' >紅色</option>\n".
    "<option value='fuchsia' style='background-color:fuchsia;color:fuchsia' >粉紅色</option>\n".
    "<option value='yellow' style='background-color:yellow;color:yellow' >黃色</option>\n".
    "<option value='lime' style='background-color:lime;color:lime' >淺綠色</option>\n".
    "<option value='aqua' style='background-color:aqua;color:aqua' >淺青綠色</option>\n".
    "<option value='black' style='background-color:black;color:black' >黑色</option>\n".
    "<option value='#333' style='background-color:#333;color:#333' >深灰色</option>\n".
    "<option value='gray' style='background-color:gray;color:gray' >灰色</option>\n".
    "<option value='silver' style='background-color:silver;color:silver' >淺灰色</option>\n".
    "<option value='white' style='background-color:white;color:white'>白色</option>\n".
    "</select> <input type='text' size='10' name='{$name}[$char]' id='$name$char' value='".($option=='full'?'"':'').($option=='purple'?'purple':'')."'/>\n";
  }
?>

<h2><span style='color:lightgrey'>上載  &gt;</span> 第二步: 上色 <span style='color:lightgrey'>&gt; 完成</span></h2>
<p>請指定各人的顏色. 自定顏色可用任何瀏覽器能閱讀的格式, e.g. pink, #FFC0C0, #FCC</p><input type='hidden' name='file' value='<?php echo $filename?>'>
<input type='hidden' name='regx_name' value='<?php echo htmlspecialchars($regx_name, ENT_QUOTES)?>'>
<input type='hidden' name='colour_type' value='<?php echo htmlspecialchars($colour_type, ENT_QUOTES)?>'><table>

<?php
  $full = $colour_type == 'full';
  $act = !empty($_REQUEST['act']);
  if ($full) {
    if ($act)
      echo "<tr><td>角色</td><td>人名</td><td>說話</td><td>動作</td>";
    else
      echo "<tr><td>角色</td><td>人名</td><td>說話/動作</td>";
  } else {
    if ($act)
      echo "<tr><td>角色</td><td>說話</td><td>動作</td>";
  }
  foreach ($result as $name => $true) {
    echo "<tr><td>$name</td><td>".colour_picker('colour', $name)."</td>";
    if ($full) echo "<td>".colour_picker('action', $name, 'full')."</td>";
    if ($act) echo "<td>".colour_picker('act', $name, 'purple')."</td>";
    echo "</tr>\n";
  }
?>

<script language="JavaScript" type="text/javascript">
var selects = document.getElementsByTagName("select");
for (var i = 0; i < selects.length; i++) {
  if (selects[i].onchange)
    selects[i].onchange();
}
</script>

<?php

/********************************************* 3RD STEP ******************************************/
/********************************************* 3RD STEP ******************************************/
} else if (!empty($_REQUEST['file'])) {
  // Read file & input
  if (!file_exists($filename = $_REQUEST['file'])) die('錯誤：找不到已作初步處理的記錄。請返回上一步或第一步重試。');
  $data = explode("\n", bzdecompress(file_get_contents($filename)));
  $regx_name = $_REQUEST['regx_name'];
  $colour = $_REQUEST['colour'];

  if ($_REQUEST['colour_type']=='block') {
    // Block coloring
    $currBlock = '';
    $currColour = '';
    $result = '';
    $line = reset($data);
    do {
      if (!$line) {
        $currBlock .= "\n";
      } else if (preg_match($regx_name, $line, $matches)) {
        $name = findName($matches);
        if ($name && !empty($colour[$name])) {
          $c = $colour[$name];
          if ($c == $currColour)
            $currBlock .= $line."\n"; // Same as last line, just keep it up
          else {
            $result .= ($currColour) ? "[color=$currColour]{$currBlock}[/color]" : $currBlock;
            $currBlock = $line."\n";
            $currColour = $c;
          }
        }
      }
      $line = next($data);
    } while ($line !== false);
    $result .= ($currColour) ? "[color=$currColour]{$currBlock}[/color]" : $currBlock;

  } else {
    // Line/Full coloring
    $full = $_REQUEST['colour_type']=='full';
    if ($full) $action = $_REQUEST['action'];
    foreach ($action as $name => $a)
      if ($a == '"')
        $action[$name] = $colour[$name];
    if (!empty($_REQUEST['act'])) {
      $act = $_REQUEST['act'];
    } else {
      $act = '';
    }

    $line = reset($data);
    do {
      if (!$line) {
        // continue;
      } else if (preg_match($regx_name, $line, $matches)) {
        $name = findName($matches);
        if ($name && ( !empty($colour[$name]) || !empty($action[$name]) )) {
          // Parsing
          $c = !empty($colour[$name]) ? $colour[$name] : '';
          $k = key($data);
          $deed = substr($line, strlen($matches[0]));
          if ($full || $act) {
            $time = $matches[1];
            $first = substr($matches[0], strlen($time));
          }

          if ($act && strpos($matches[0], '*') !== false) {
            // action colouring
            if (!empty($act[$name]))
              $data[$k] = $time."[color=$act[$name]]$first{$deed}[/color]";
          } else if ($full) {
            // full colouring
            $a = !empty($action[$name]) ? $action[$name] : '';
            if ($c && ($a == $c))
              $data[$k] = $time."[color=$c]$first{$deed}[/color]";
            else
              $data[$k] =
                  $time .
                  ($c ? "[color=$c]{$first}[/color]" : $first ) .
                  ($a ? "[color=$a]{$deed}[/color]" : $deed );
          } else {
            // line colouring
            $data[$k] = $matches[0]."[color=$c]{$deed}[/color]";
          }
        }
      }
      $line = next($data);
    } while ($line !== false);
  }
?>

<script language="JavaScript" type="text/javascript">
<!-- "Flash Copier" by Jeffothy ( http://www.jeffothy.com/weblog/clipboard-copy/ ) -->
function copy(inElement) {
  if (inElement.createTextRange) {
    var range = inElement.createTextRange();
    if (range)
      range.execCommand('Copy');
  } else {
    var flashcopier = 'flashcopier';
    if(!document.getElementById(flashcopier)) {
      var divholder = document.createElement('div');
      divholder.id = flashcopier;
      document.body.appendChild(divholder);
    }
    document.getElementById(flashcopier).innerHTML = '';
    var divinfo = '<embed src="../img/_clipboard.swf" FlashVars="clipboard='+encodeURIComponent(inElement.value.replace(/\n/g,'\r\n'))+'" width="0" height="0" type="application/x-shockwave-flash"></embed>';
    document.getElementById(flashcopier).innerHTML = divinfo;
  }
}
</script>

<h2><span style='color:lightgrey'> 上載  &gt; 上色 &gt;</span> 第三步: 完成</span></h2>

  <p>
	 上色完成! <input type='button' id='copy' value='複制' onclick='copy(document.getElementById("content"));return false;' disabled='disabled'>
  </p>
  <textarea warp='off' id='content' rows='30' cols='100'>
<?php echo isset($result) ? $result : implode("\n",$data) ?>
  </textarea>

  <script language="JavaScript" type="text/javascript">document.getElementById('copy').disabled = false</script>

  <p></p>
  <hr/>

  Flash 複制器由 Jeffothy 制作 ( <a href='http://www.jeffothy.com/weblog/clipboard-copy/'>http://www.jeffothy.com/weblog/clipboard-copy/</a> )
  <p></p>

  <table>

<?php
}


?>

    <tr><td></td><td><input type='button' value='重頭開始' onclick='window.location.href=window.location.href'/> &nbsp; <input type='submit' value='下一步'/></td></tr>
  </table>


</form>
</body>
</html>
