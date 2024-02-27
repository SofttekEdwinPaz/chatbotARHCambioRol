const fs = require('fs');
const leerPDFsDeCarpeta = require('./leerPDFsCarpeta')

const carpetaDocumentos = "C:\\Users\\edwin.paz\\Desktop\\ChatBot_ARH_Softtek\\Documentos\\ARH";
(async () =>{
    const {embeddings, documentName} = await leerPDFsDeCarpeta(carpetaDocumentos)
    console.log(embeddings);
    console.log(documentName);

// Función para guardar los embeddings en un archivo JSON
async function saveEmbeddingsToFile(embeddings, documentName) {
    console.log(`Se ingresa a función saveEmbeddingsToFile`)
    const dataToSave = {
        document: documentName,
        embedding: embeddings,
      };

  try {
    // Leemos el archivo JSON existente (si existe) o creamos uno nuevo
    let embeddingsData = [];
    try {
      const fileContent = await fs.promises.readFile('embeddings.json', 'utf-8');
      embeddingsData = JSON.parse(fileContent);
    } catch (error) {
      // Si el archivo no existe, lo crearemos al guardar el primer embedding
    }

    // Agregamos el nuevo embedding al arreglo
    embeddingsData.push(dataToSave);

    // Guardamos el arreglo completo en el archivo JSON
    await fs.promises.writeFile('embeddings.json', JSON.stringify(embeddingsData, null, 2));
    console.log(`Embeddings guardados con éxito.`);
    console.log(`Finaliza función saveEmbeddingsToFile`)
  } catch (error) {
    console.error('Error al guardar el embedding:', error);
  }
}
// Llama a la función para guardar el embedding en el archivo JSON
await saveEmbeddingsToFile(embeddings, documentName);
})();

