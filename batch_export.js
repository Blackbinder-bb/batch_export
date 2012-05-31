//=============================================================================
//  MuseScore
//  Linux Music Score Editor
//  $Id:$
//
//  Batch Export plugin
//
//  Copyright (C)2008-2011 Werner Schweer and others
//
//  This program is free software; you can redistribute it and/or modify
//  it under the terms of the GNU General Public License version 2.
//
//  This program is distributed in the hope that it will be useful,
//  but WITHOUT ANY WARRANTY; without even the implied warranty of
//  MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
//  GNU General Public License for more details.
//
//  You should have received a copy of the GNU General Public License
//  along with this program; if not, write to the Free Software
//  Foundation, Inc., 675 Mass Ave, Cambridge, MA 02139, USA.
//=============================================================================

//
//    This is ECMAScript code (ECMA-262 aka "Java Script")
//

// Setup some global variables
var pluginName = qsTr("Batch Export");
var outFormats;
var inFormats;
var form;


//---------------------------------------------------------
//    init
//    this function will be called on initial load of
//    this plugin, currently at start of mscore
//---------------------------------------------------------

function init () {
  //QMessageBox.information(0, pluginName, "init()");
};


// generates a <format> file from the specified file, if no up-to-date one already exists
// returns filename of generated file, or empty string if no file generated
function process_one (source, inFormat, outFormatnotused) {
  var inFile = new QFileInfo(source);
  var theScore; 
  var list ="";

  for (i=0; i<outFormats.length; i++) {
    var target = source.replace(inFormat, outFormats[i]);
    var targetFile = new QFileInfo(target);
    var doit = false;

    if (!targetFile.exists())
      doit = true;
    else if (targetFile.lastModified() < inFile.lastModified()) {
      var targetHandle = new QFile(target);
      if (targetHandle.remove())
        doit = true;
      else
        QMessageBox.warning(0, pluginName, qsTr("Unable to delete %1") .arg(target));
    }
    if (doit) { // got for it
      if (!theScore) { //( not yet open
        theScore = new Score();
        theScore.load(source);
      }
      theScore.save(target, outFormats[i]);

      list += targetFile.fileName() + "\n";
    }
  }
  if (theScore) // is a score open?
    if (typeof theScore.close === 'function') // does not exist on 1.1 or earlier
      theScore.close();
  return list;
};

// query user for directory
// loop through all files in folder
// process all ".<inFormats[i]>$" files using process_one()
// export them to all <outFormats[j]>
function work () {
  var dirString = QFileDialog.getExistingDirectory(0, pluginName + qsTr(": Select Folder"), "", 0);
  if (!dirString) {
    QMessageBox.warning(0, pluginName, qsTr("No folder selected"));
    return;
  }

  var dir = new QDir(dirString);
  var dirIt = new QDirIterator(dir);
  var scoreList = "";

  while (dirIt.hasNext()) {
    var file = dirIt.next();
    for (i=0; i<inFormats.length; i++)
      if (file.match("\." + inFormats[i] + "$"))
        scoreList += process_one(file, inFormats[i]);
  }

  if (scoreList == "")
    scoreList = qsTr("\n\nAll files are up to date\n");
  else
    scoreList = qsTr("\n\nFile(s) exported:\n\n%1") .arg(scoreList);

  QMessageBox.information(0, pluginName, dirString + scoreList);
};

function evalForm () {
  if (form.groupBox_inFormats.checkBox_mscz.checked) inFormats.push("mscz");
  if (form.groupBox_inFormats.checkBox_mscx.checked) inFormats.push("mscx");
  if (form.groupBox_inFormats.checkBox_msc.checked)  inFormats.push("msc");
  if (form.groupBox_inFormats.checkBox_xml.checked)  inFormats.push("xml");
  if (form.groupBox_inFormats.checkBox_mxl.checked)  inFormats.push("mxl");
  if (form.groupBox_inFormats.checkBox_mid.checked)  inFormats.push("mid");
  if (form.groupBox_inFormats.checkBox_midi.checked) inFormats.push("midi");
  if (form.groupBox_inFormats.checkBox_car.checked)  inFormats.push("car");
  if (form.groupBox_inFormats.checkBox_md.checked)   inFormats.push("md");
  if (form.groupBox_inFormats.checkBox_cap.checked)  inFormats.push("cap");
  if (form.groupBox_inFormats.checkBox_bww.checked)  inFormats.push("bww");
  if (form.groupBox_inFormats.checkBox_mgu.checked)  inFormats.push("mgu");
// upercase needed too?
//if (form.groupBox_inFormats.checkBox_MGU.checked)  inFormats.push("MGU");
  if (form.groupBox_inFormats.checkBox_sgu.checked)  inFormats.push("sgu");
// upper case needed too?
//if (form.groupBox_inFormats.checkBox_SGU.checked)  inFormats.push("SGU");
  if (form.groupBox_inFormats.checkBox_ove.checked)  inFormats.push("ove");
  if (form.groupBox_inFormats.checkBox_scw.checked)  inFormats.push("scw");
  if (form.groupBox_inFormats.checkBox_GTP.checked)  inFormats.push("GTP");
  if (form.groupBox_inFormats.checkBox_GP3.checked)  inFormats.push("GP3");
  if (form.groupBox_inFormats.checkBox_GP4.checked)  inFormats.push("GP4");
  if (form.groupBox_inFormats.checkBox_GP5.checked)  inFormats.push("GP5");
  if (inFormats.length == 0) {
    QMessageBox.warning(0, pluginName, qsTr("No input format selected"));
    exit();
  }

  if (form.groupBox_outFormats.checkBox_mscz.checked) outFormats.push("mscz");
  if (form.groupBox_outFormats.checkBox_mscx.checked) outFormats.push("mscx");
  if (form.groupBox_outFormats.checkBox_xml.checked)  outFormats.push("xml");
  if (form.groupBox_outFormats.checkBox_mxl.checked)  outFormats.push("mxl");
  if (form.groupBox_outFormats.checkBox_mid.checked)  outFormats.push("mid");
  if (form.groupBox_outFormats.checkBox_pdf.checked)  outFormats.push("pdf");
  if (form.groupBox_outFormats.checkBox_ps.checked)   outFormats.push("ps");
  if (form.groupBox_outFormats.checkBox_png.checked)  outFormats.push("png");
  if (form.groupBox_outFormats.checkBox_svg.checked)  outFormats.push("svg");
  if (form.groupBox_outFormats.checkBox_ly.checked)   outFormats.push("ly");
  if (form.groupBox_outFormats.checkBox_wav.checked)  outFormats.push("wav");
  if (form.groupBox_outFormats.checkBox_flac.checked) outFormats.push("flac");
  if (form.groupBox_outFormats.checkBox_ogg.checked)  outFormats.push("ogg");
  if (form.groupBox_outFormats.checkBox_mp3.checked)  outFormats.push("mp3");
  if (outFormats.length == 0) {
    QMessageBox.warning(0, pluginName, qsTr("No output format selected"));
    exit();
  }

  work();
};

function setDefaults () {
  if (form) {
    // enable/disable, depening on version
    if ( mscoreMajorVersion >= 2) {
      form.groupBox_inFormats.checkBox_msc.enabled =  false; // no longer supported?
      form.groupBox_inFormats.checkBox_scw.enabled =  true;
      form.groupBox_inFormats.checkBox_GTP.enabled =  true;
      form.groupBox_inFormats.checkBox_GP3.enabled =  true;
      form.groupBox_inFormats.checkBox_GP4.enabled =  true;
      form.groupBox_inFormats.checkBox_GP5.enabled =  true;
      form.groupBox_outFormats.checkBox_mp3.enabled = true;
    } else {
      form.groupBox_inFormats.checkBox_msc.enabled =  true;
      form.groupBox_inFormats.checkBox_scw.enabled =  false;
      form.groupBox_inFormats.checkBox_GTP.enabled =  false;
      form.groupBox_inFormats.checkBox_GP3.enabled =  false;
      form.groupBox_inFormats.checkBox_GP4.enabled =  false;
      form.groupBox_inFormats.checkBox_GP5.enabled =  false;
      form.groupBox_outFormats.checkBox_mp3.enabled = false;
    }
    // check/uncheck to the default, inFormats "mscz", outformats "pdf"
    form.groupBox_inFormats.checkBox_mscz.checked =  true;
    toggle_mscz(true); // disable corresponding outFormat
    form.groupBox_inFormats.checkBox_mscx.checked =  false;
    toggle_mscx(false); // enable corresponding outFormat
    form.groupBox_inFormats.checkBox_msc.checked =   false;
    form.groupBox_inFormats.checkBox_xml.checked =   false;
    toggle_xml(false); // enable corresponding outFormat
    form.groupBox_inFormats.checkBox_mxl.checked =   false;
    toggle_mxl(false); // enable corresponding outFormat
    form.groupBox_inFormats.checkBox_mid.checked =   false;
    toggle_mid(false); // enable corresponding outFormat
    form.groupBox_inFormats.checkBox_midi.checked =  false;
    form.groupBox_inFormats.checkBox_car.checked =   false;
    form.groupBox_inFormats.checkBox_md.checked =    false;
    form.groupBox_inFormats.checkBox_cap.checked =   false;
    form.groupBox_inFormats.checkBox_bww.checked =   false;
    form.groupBox_inFormats.checkBox_mgu.checked =   false;
  // upercase needed too?
  //form.groupBox_inFormats.checkBox_MGU.checked =   false;
    form.groupBox_inFormats.checkBox_sgu.checked =   false;
  // upercase needed too?
  //form.groupBox_inFormats.checkBox_SGU.checked =   false;
    form.groupBox_inFormats.checkBox_ove.checked =   false;
    form.groupBox_inFormats.checkBox_scw.checked =   false;
    form.groupBox_inFormats.checkBox_GTP.checked =   false;
    form.groupBox_inFormats.checkBox_GP3.checked =   false;
    form.groupBox_inFormats.checkBox_GP4.checked =   false;
    form.groupBox_inFormats.checkBox_GP5.checked =   false;
    inFormats =  new Array(); // empty array, work() will fill it

    form.groupBox_outFormats.checkBox_mscx.checked = false;
    form.groupBox_outFormats.checkBox_xml.checked =  false;
  //form.groupBox_outFormats.checkBox_xml.checked =  true;
  //toggle_xml(true);
    form.groupBox_outFormats.checkBox_mxl.checked =  false;
    form.groupBox_outFormats.checkBox_mid.checked =  false;
    form.groupBox_outFormats.checkBox_pdf.checked =  true;
    form.groupBox_outFormats.checkBox_ps.checked =   false;
    form.groupBox_outFormats.checkBox_png.checked =  false;
    form.groupBox_outFormats.checkBox_svg.checked =  false;
    form.groupBox_outFormats.checkBox_ly.checked =   false;
    form.groupBox_outFormats.checkBox_wav.checked =  false;
    form.groupBox_outFormats.checkBox_flac.checked = false;
    form.groupBox_outFormats.checkBox_ogg.checked =  false;
    form.groupBox_outFormats.checkBox_mp3.checked =  false;
    outFormats = new Array(); // empty array, work() will fill it
  } else {
    // no UI, fall back to behavoir of previous version
    inFormats =  new Array("mscz");
  //inFormats =  new Array("mscz", "mscx");
    outFormats = new Array("pdf");
  //outFormats = new Array("xml", "pdf");
  }
};


function toggle_mscz (enable) {
  if (enable) {
    form.groupBox_outFormats.checkBox_mscz.checked  = false;
    form.groupBox_outFormats.checkBox_mscz.enabled  = false;
 } else {
    form.groupBox_outFormats.checkBox_mscz.enabled  = true;
 }
};

function toggle_mscx (enable) {
  if (enable) {
    form.groupBox_outFormats.checkBox_mscx.checked  = false;
    form.groupBox_outFormats.checkBox_mscx.enabled  = false;
  } else {
    form.groupBox_outFormats.checkBox_mscx.enabled  = true;
  }
};

function toggle_xml (enable) {
  if (enable) {
    form.groupBox_outFormats.checkBox_xml.checked  = false;
    form.groupBox_outFormats.checkBox_xml.enabled  = false;
  } else {
    form.groupBox_outFormats.checkBox_xml.enabled  = true;
  }
};

function toggle_mxl (enable) {
  if (enable) {
    form.groupBox_outFormats.checkBox_mxl.checked  = false;
    form.groupBox_outFormats.checkBox_mxl.enabled  = false;
  } else {
    form.groupBox_outFormats.checkBox_mxl.enabled  = true;
  }
};

function toggle_mid (enable) {
  if (enable) {
    form.groupBox_outFormats.checkBox_mid.checked  = false;
    form.groupBox_outFormats.checkBox_mid.enabled  = false;
  } else {
    form.groupBox_outFormats.checkBox_mid.enabled  = true;
  }
};


function run () {
  // read the UI file and create a form out of it
  var loader = new QUiLoader(null);
  var uiFile = new QFile(pluginPath + "/batch_export.ui");
  uiFile.open(QIODevice.OpenMode(QIODevice.ReadOnly, QIODevice.Text));
  form = loader.load(uiFile, null);

  if (form) { // Todo!!
    // initialize some widget values
    form.windowTitle = pluginName + ": " + form.windowTitle;

    setDefaults();
    
    // connect signals
    form.buttonBox.accepted.connect(evalForm);
    form.buttonBox.rejected.connect(close);
    form.pushButton_reset.released.connect(setDefaults);
    form.groupBox_inFormats.checkBox_mscz.toggled.connect(toggle_mscz);
    form.groupBox_inFormats.checkBox_mscx.toggled.connect(toggle_mscx);
    form.groupBox_inFormats.checkBox_xml.toggled.connect(toggle_xml);
    form.groupBox_inFormats.checkBox_mxl.toggled.connect(toggle_mxl);
    form.groupBox_inFormats.checkBox_mid.toggled.connect(toggle_mid);

    // show the form
    form.show();
  } else {
    // Why doesn't this work but gives an empty message?
    //QMessageBox.warning(0, pluginName, qsTr("Can't load GUI dialog %1, continuing with default settings (%2 to %3)") .arg(uiFile) .arg(inFormats) .arg(outFormats));
    // fallback to behavoir of the previous non-GUI version
    setDefaults();
    work();
  }
};


//---------------------------------------------------------
//    close
//    this function will be called on close (unload)
//    of this plugin, currently at close of mscore
//    optional...
//---------------------------------------------------------

function close() {
  //QMessageBox.information(0, pluginName, "close()");
};


//---------------------------------------------------------
//    menu:  defines where the function will be placed
//           in the menu structure
//---------------------------------------------------------

var mscorePlugin = {
  menu: 'Plugins.' + pluginName,
  init: init,
  run:  run,
  onClose: close
};

mscorePlugin;
