# Program Structure #

This program has a single-file design, so all structures are in context of this main file.




# GUI #

The GUI is composed of a shared header plus a few individual pages.

Each page is a top level div, and only one is showing at any time.  Each page has a unique id of 'action_{id}'._

Most GUI components has no text and instead has an id, and all will be localised by script.

## Pages ##
  1. **action\_input**: Input page
    * Input logs by copy & paste or by dragging a file.
    * Input conversion such as convert to plain text and Chinese conversion.
    * Show parsed names in real time. <br><br>
</li></ul>  1. **action\_colour**: Colouring page
    * Select colours to be used for each speaker.
    * Reset colours to default. <br><br>
</li></ul>  1. **action\_preview**: Preview page
    * A preview of the colouring result.
    * In the future, should allows changing preview background. <br><br>
</li></ul>  1. **action\_output**: Output page
    * Result of input in an editable text area.
    * In the future, should allows downloading results. <br><br>
</li></ul>  1. **action\_about**: About page
    * Shows basic information, license, acknowledgements, and change log

## GUI Resources ##

  * Images are embed inline using data url.
  * To avoid duplication, header logo is copied from page icon on initialisation.
  * Localisation resources are stored in script.


# Code #

JavaScript Code follows the HTML pages.
We are using strict mode, and the code is mainly function based.
Each function should have a comment on what it does.

The code goes in this order:

  1. Default options.
  1. Localisation resources.
  1. Functions shared by all pages.
  1. Initialisation code
    1. Detect and decide languages from `location.search || navigator.language || navigator.userLanguage`
    1. Localise title, copy logo, load options, and switch to input page.
  1. Functions for each pages, in order of pages.
  1. Chinese conversion mapping.



## Global Variables ##

<dt> <b>defaultOptions</b> </dt>
<dd>   Default options, shouldn't be changed. </dd>
<dt> <b>options</b> </dt>
<dd>   Current options. </dd>
<dt> <b>txt</b> </dt>
<dd>   Localisation resources. Initialisation will pick a language so instead of <code>txt.en.err_noFileAPI</code> the code should just use <code>txt.err_noFileAPI</code> (note the absent of <code>.en</code>) </dd>
<dt> <b>datePattern</b> </dt>
<dd>   Date detection pattern in use for textual logs. </dd>
<dt> <b>nameBoundary</b> </dt>
<dd>   Name detection pattern in use for textual logs. </dd>
<dt> <b>nameList</b> </dt>
<dd>   Detected list of speakers. </dd>
<dt> <b>log</b> </dt>
<dd>   Lines of textual log input. </dd>