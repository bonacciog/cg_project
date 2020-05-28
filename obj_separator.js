var __filename = process.argv[2];
var new_filename = process.argv[3];
var file_number=0;
var content = new Buffer("Dummy weird string: {[¦¦]}", "utf-8") ;
myWriteFile(file, content) ;
 
function myWriteFile(file, content) {
  fs.writeFile(file, content, function (err) {
    if (err) return console.log(err) ;
    console.log("Written: " + file) ;
  });
} ;


const readline = require('readline');
const fs = require('fs');

var file = 'path.to.file';
var rl = readline.createInterface({
    input: fs.createReadStream(file),
    output: process.stdout,
    terminal: false
});

rl.on('line', function (line) {
    if(line.charAt(0)!='o'){
        myWriteFile(new_filename.concat(file_number).concat(".obj"),line)
    }
    else if(file_)
});