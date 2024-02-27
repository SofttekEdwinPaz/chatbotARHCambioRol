const fs = require('fs');
const pdf = require('pdf-parse');
const { exec } = require('child_process');
const os = require('os');
const path = require('path');
const limpiarTexto = require('./limpiezaTexto')

function contarTokensPython(filePath) {
    /**
     * Función encargada de conectarse con un script de python para retornar la cantidad de tokens que tiene el documento.
     */
  return new Promise((resolve, reject) => {
    exec(`python C:\\Users\\edwin.paz\\Desktop\\ChatBot_ARH_Softtek\\base-baileys-json\\contadorTokens\\contar_tokens.py "${filePath}"`, (error, stdout, stderr) => {
      if (error) {
        reject(error);
      } else {
        resolve(stdout.trim());
      }
    });
  });
}

const extraerTextoPDFs = async (filePath) => {
    /**
     * Función encargada de extraer el texto de los documentos PDFs
     */
    console.log(`Se ingresa a función extraerTextoPDFs`)
  try {
    const dataBuffer = fs.readFileSync(filePath);
    const data = await pdf(dataBuffer);
    const tempFilePath = path.join(os.tmpdir(), 'tempPdfText.txt');
    fs.writeFileSync(tempFilePath, data.text, 'utf-8');
    const tokensCantidad = await contarTokensPython(tempFilePath); //Se debe organizar esta línea de código para que lo que se vaya a leer sea el archivo luego del preprocesamiento y limpieza
    // console.log(`Esta sería la cantidad de tokens: ${tokensCantidad} que tiene el archivo ${filePath}`);
    fs.unlinkSync(tempFilePath); // Eliminar el archivo temporal
    const textoLimpio = limpiarTexto(data.text)
    const respuesta = {
        texto: textoLimpio,
        cantidadTokens: tokensCantidad
    }
    // console.log(respuesta)
    console.log(`Finaliza función extraerTextoPDFs`)
    return respuesta;
  } catch (error) {
    console.error("Error al extraer texto del PDF:", error);
    return null;
  }
}

module.exports = extraerTextoPDFs


// async function main() {
//   const { texto, cantidadTokens } = await extraerTextoPDFs(filePath);
//   console.log(`Aquí comenzaría a generar el embedding del tamaño de: ${cantidadTokens}.`);
//   console.log(`Aquí comenzaría el texto del embedding: ${texto}.`);
//   const embedding = await generateEmbedding(texto);

//   console.log(embedding);
// }

// main();

