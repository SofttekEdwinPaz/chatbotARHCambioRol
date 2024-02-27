const OpenAI = require('openai')
const openai = new OpenAI()

const generateEmbedding = async (text) => {
  console.log('Inicia ejecución de función generateEmbedding');
    text = text.replace("\n"," ");//Preprocesamiento básico (limpieza) de texto.
    try {
      const response = await openai.embeddings.create({
        model: "text-embedding-ada-002", // Puedes elegir el modelo de embedding adecuado
        input: text,
        encoding_format: "float",
      });
      // console.log("Respuesta completa:", response);
      // Accediendo al embedding
      const embedding = response.data[0].embedding;
      // console.log(`Esta sería la respuesta del embedding: ${embedding}`);
      console.log('Finaliza ejecución de función generateEmbedding');
      return embedding;
    } catch (error) {
      console.error("Error completo al generar embedding:", error);
      return null;
    }
  }

  module.exports = generateEmbedding
  
