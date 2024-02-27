require('dotenv').config();
const { VectorDBQAChain, ConversationalRetrievalQAChain } = require("langchain/chains")
const { PromptTemplate } = require("@langchain/core/prompts");
const { PDFLoader } = require("langchain/document_loaders/fs/pdf");
const { RecursiveCharacterTextSplitter } = require("langchain/text_splitter");
const { OpenAIEmbeddings,ChatOpenAI, OpenAI } = require("@langchain/openai");
const { RunnablePassthrough, RunnableSequence } = require("@langchain/core/runnables");
const {MemoryVectorStore} = require("@langchain/core/memory")
const { StringOutputParser } = require("@langchain/core/output_parsers");
const {PineconeStore} = require("@langchain/pinecone")
const { Pinecone } = require('@pinecone-database/pinecone');
const fs = require('fs');
const path = require('path');
// Configuración de las variables de entorno
const process = require('process');
// const {pinecone} = require('pinecone-client');

const pinecone = new Pinecone({
    apiKey: "8332c8cd-13af-4bef-9e13-6069cb01871c",
    environment: "gcp-starter"
})
indexName_pinecone = "conocimiento4softtek"
const pineconeIndex = pinecone.Index(indexName_pinecone)
const chatModel = new ChatOpenAI({ temperature:0.1 });
const splitter = new RecursiveCharacterTextSplitter();
const embeddings_OAI = new OpenAIEmbeddings();
const pdfDirectory = "C:\\Users\\edwin.paz\\Desktop\\ChatBot_ARH_Softtek\\Documentos\\ARH";
const prompt = PromptTemplate.fromTemplate(`Tu nombre es *TAPI*, chatbot creado por softtek. Responde la siguiente pregunta hecha por el softtekian, basandote en el contexto dado. Procura ser muy amable y con un estilo softtekian al responder. debes dar la opción de finalizar presionando el número 0, solo cuando termines de dar la respuesta completa :
{context}

Pregunta: {question}`);

async function checkIfIndexExists(indexName) {
    try {

        // Obtén la lista de índices existentes
        const response = await pinecone.listIndexes();
        const existingIndexes = response.map(indexObj => indexObj.name)
        console.log(`Lista de índices existentes: ${existingIndexes.toString()}`)

        // Verifica si el índice dado ya existe
        return existingIndexes.includes(indexName);
    } catch (error) {
        console.error("Error al verificar el índice en Pinecone:", error);
        return false;
    }
}

async function loadPDFs(directory) {
    console.log("Se ingresa a loadPDFs")
    const files = fs.readdirSync(directory);
    const pdfFiles = files.filter(file => path.extname(file).toLowerCase() === '.pdf');
    let splitDocs = [];
    for (const file of pdfFiles) {
        const filePath = path.join(directory, file);
        const loader = new PDFLoader(filePath, { splitPages: false });
        const docs = await loader.load();
        const splitDocsFromPDF = await splitter.splitDocuments(docs);
        splitDocs = splitDocs.concat(splitDocsFromPDF.map(doc => doc));
    }
    return splitDocs
}

async function chatbotFunction(question) {
    let vectorstore;
    const indexExists = await checkIfIndexExists(indexName_pinecone);    
    if (!indexExists) {
        console.log("El índice no existe. Creando un nuevo índice en Pinecone.");
        const splitDocs = await loadPDFs(pdfDirectory);
        console.log("Se cargan los PDFs y se dividen correctamente.");
        vectorstore = await PineconeStore.fromDocuments(splitDocs, embeddings_OAI, { pineconeIndex });
        vectorstore = await PineconeStore.fromExistingIndex(embeddings_OAI,{pineconeIndex})
        console.log("Se creó correctamente el vector store.");
    } else {
        console.log("El índice ya existe. Utilizando el índice existente.");
        vectorstore = await PineconeStore.fromExistingIndex(embeddings_OAI,{pineconeIndex})
    }
    /* Use as part of a chain (currently no metadata filters) */
    const retriever = vectorstore.asRetriever()
    const serializeDocs = (docs) => docs.map((doc) => doc.pageContent.replace(/\n/g, ""));
    const chain = RunnableSequence.from([
        {
            context: retriever.pipe(serializeDocs),
            question: new RunnablePassthrough()
        },
        prompt,
        chatModel,
        new StringOutputParser(),
    ]);
    const response = await chain.invoke(question)
    return response
}

module.exports = chatbotFunction;
