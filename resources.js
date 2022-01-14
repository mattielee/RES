//EXCEL TO JSON
function parseExcel(file){
  var reader = new FileReader();
  console.log(file);

  reader.onload = function(e) {
    var data = e.target.result;
    
    var workbook = XLSX.read(data, {
      type: 'binary'
    });

    var result = new Array;
    workbook.SheetNames.forEach(function(sheetName) {
      // Here is your object
      var XL_row_object = XLSX.utils.sheet_to_row_object_array(workbook.Sheets[sheetName]);
      result.push(XL_row_object); //push to result so JSON can be accessed outside of loop
    })
    CreateTableFromJSON(result[0]); 
  };

  reader.onerror = function(ex) {
    console.log(ex);
  };

  reader.readAsBinaryString(file);
};
var table;
var headers = new Array; //headers
//DYNAMIC TABLE (JSON TO TABLE)
function CreateTableFromJSON(JSONArray) {
  //Extract data for headers
  var col = new Array;
         for (var key in JSONArray[0]) {
            if(key=="Link"){
              col.push({"title":key, "field":key, "formatter":"link", "formatterParams":{
                "label":"Link",
                "target":"_blank"
              }});
            }
            else{
              col.push( {"title":key, "field":key});
            }
            headers.push(key);
          }
  //Table constructor       
  table= new Tabulator("#resourceTable",{ //make new Tabulator table with id:resourceTable
    height: "100%",
    layout: "fitTable",
    data: JSONArray, //set data as JSONArray
    columns: col //set column headers
  });

  
}

//START (initiate process of excel to table)
var oReq = new XMLHttpRequest();

oReq.onloadend = function() {
parseExcel(oReq.response);
}

url = "ReferencesLinks.xlsx"; //where to extract data from
oReq.open("GET", url); 
oReq.responseType = "blob";
oReq.send();

//ADD SEARCH CAPABILITY
  //Define variables for input elements
  var searchEl = document.getElementById("search");

  //search function
  function updateFilter(){
    var headerFilterOrs = new Array;
    
    for(let i=0; i<headers.length; i++){
        headerFilterOrs.push({
          "field":headers[i],
          "type": "like",
          "value": searchEl.value
        })
    }
    console.log(headerFilterOrs)
    table.setFilter([headerFilterOrs])
  }

  //Update filter on value change
  document.getElementById("search").addEventListener("keyup", updateFilter);