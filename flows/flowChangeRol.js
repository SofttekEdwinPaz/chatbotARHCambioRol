const { addKeyword } = require('@bot-whatsapp/bot');
// const  chatbotFunction  = require("../utils/RAG2")
const  chatbotFunction  = require("../utils/RAG")

const flowChangeRol = addKeyword('Cambio rol')
    .addAction(async (ctx, {state, flowDynamic,fallBack}) => {
        try {

            const estadoActual = state.getMyState();
            console.log(`Mensaje actual: ${estadoActual.mensajeEntrante}`);
            // Llamar a la función RAG para obtener respuesta
            // const respuestaRAG2 = await chatbotFunction(estadoActual.mensajeEntrante);
            const respuestaRAG = await chatbotFunction(estadoActual.mensajeEntrante);
            console.log(`Respuesta RAG: ${respuestaRAG}`);

            return fallBack(`${respuestaRAG}`);
        } catch (error) {
            console.error("Error al generar embedding:", error);
            return null;
        }
    });

module.exports = flowChangeRol