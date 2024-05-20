const Joi = require('joi');
const XLSX = require('xlsx');

exports.parseExcel = function (file) {
  var workbook = XLSX.read(file);
  var sheet_name_list = workbook.SheetNames;
  
  var data = [];

  sheet_name_list.forEach(function(y) {
    var worksheet = workbook.Sheets[y];
    var headers = {};
    for(var z in worksheet) {
      if(z[0] === '!') continue;
      //parse out the column, row, and value
      var col = z.substring(0,1);
      var row = parseInt(z.substring(1));
      var value = worksheet[z].v;

      //store header names
      if(row == 1) {
          headers[col] = value;
          continue;
      }

      if(!data[row]) data[row]={};
      data[row][headers[col]] = value;
    }
    //drop those first two rows which are empty
    data.shift();
    data.shift();
  });

  return data;
} 