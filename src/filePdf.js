import fs from 'fs';
import pdfParse from 'pdf-parse';

let dataBuffer = fs.readFileSync('./pdf.pdf');

// Usamos pdf-parse para parsear el buffer
pdfParse(dataBuffer).then(function(data) {
    // Imprimimos el texto del PDF
    console.log(data.text);        
}).catch(function(error){
    // En caso de error, imprimimos el error
    console.error(error);
});
