const fs = require('fs').promises;
const path = require('path');
const extraerTextoPDFs = require('./extraerTextoPDFs');
const generateEmbedding = require('./generarEmbeddings');


const leerPDFsDeCarpeta = async (carpeta) => {
    console.log('Inicia ejecución de función leerPDFsDeCarpeta');
    const resultados = []; // Matriz para almacenar los resultados

    try {
        const archivos = await fs.readdir(carpeta);

        for (const archivo of archivos) {
            if (path.extname(archivo).toLowerCase() === '.pdf') {
                const filePath = path.join(carpeta, archivo);
                const { texto, cantidadTokens } = await extraerTextoPDFs(filePath);
                const embeddings = await generateEmbedding(texto);

                const resultadoEmbeddings = {
                    document: filePath,
                    embedding: embeddings
                };

                resultados.push(resultadoEmbeddings); // Agregar resultado a la matriz
            }
        }

        console.log('Finaliza ejecución de función leerPDFsDeCarpeta');
        // Devolver los resultados como un objeto
        return {
            documentName: resultados.map(result => result.document),
            embeddings: resultados.map(result => result.embedding)
        };
    } catch (error) {
        console.error("Error al leer la carpeta o al procesar archivos:", error);
    }
}




module.exports = leerPDFsDeCarpeta;