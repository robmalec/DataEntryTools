function findBadResps() {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sheet = ss.getActiveSheet();
  var badResps = {}; //TODO: Rewrite badResps to be an array of section variables
 
  var numRows = sheet.getDataRange().getValues().length;
  var numResps = (sheet.getLastColumn() - 4);
  
  var range = sheet.getRange(1,5,numRows, numResps);
  var namesRange = sheet.getRange(1,1,numRows,1);
  var sectionsRange = sheet.getRange(1,3,numRows,1);
  
  var badRespNames = new Array();
  
  var badRespFound = false;
  
  //Iterating through spreadsheet, finding all "?" responses
  for (row = 1; row <= numRows; row++)
  {
    badRespFound = false;
    //thisName = sectionsRange.getCell(row,1).getValue() + " " + namesRange.getCell(row,1).getValue();
    if (!range.getCell(row,1).isBlank())
    {
      for (col = 1; col <= numResps; col++)
      {
        if (badRespCondition(range.getCell(row, col).getValue()))//TODO: Rewrite this to be a conditional using a function that is passed to this one as a parameter so that this can be used for multiple purposes
        {
          if (!badRespFound)
          {
            badRespFound = true;
            badResps[row] = new Array();
            badRespNames.push(row);
          }
          badResps[row].push(col);
        }
      }
    }
    else
    {
      badResps[row] = new Array();
      badResps[row].push("Missing entire test");
      badRespNames.push(row);
    }
  }
  
  
  
  
  
  //Creating new spreadsheet, populating with all bad responses
      Browser.msgBox("Bad response search finished");

    var badRespsSheet = ss.getSheetByName("Bad responses");
    if (badRespsSheet == null) badRespsSheet = ss.insertSheet("Bad responses");
    SpreadsheetApp.setActiveSheet(badRespsSheet);
    
    var numBadRespNames = badRespNames.length;
    for (nameIndex = 0; nameIndex < numBadRespNames; nameIndex++)
    {
      SpreadsheetApp.getActiveSheet().getRange(getPrintingRow(nameIndex),1).setValue(sectionsRange.getCell(badRespNames[nameIndex], 1).getValue() + " " + namesRange.getCell(badRespNames[nameIndex],1).getValue());

      var numBadResps = badResps[badRespNames[nameIndex]].length;
      for (c = 0; c < numBadResps; c++)
      {
        var a = badResps[badRespNames[nameIndex]][c];
        SpreadsheetApp.getActiveSheet().getRange(getPrintingRow(nameIndex),(c + 2)).setValue(a);
      }
    }
 
}
function getPrintingRow(nameIndex)
{
  return (2*(nameIndex + 1) - 1);
}
function badRespCondition(cellValue)
{
  return cellValue == "?";
}
