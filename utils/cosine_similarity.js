const fs = require('fs');
const path = require('path');
const generateEmbedding = require('./generarEmbeddings');

function cosineSimilarityPython(embedding1, embedding2) {
    return new Promise((resolve, reject) => {
        exec(`python contadorTokens\\cosine_similarity_script.py '${embedding1}' '${embedding2}'`, (error, stdout, stderr) => {
            if (error) {
                reject(error);
            } else {
                resolve(parseFloat(stdout.trim()));
            }
        });
    });
}

async function compareWithEmbeddings(userMessage) {
    const userEmbedding = await generateEmbedding(userMessage);
    console.log(`Este sería userEmbedding ${userEmbedding}`)
    const embeddings = JSON.parse(fs.readFileSync(path.join(__dirname, 'embeddings.json'), 'utf8'));
    console.log(`Este sería embeddings ${embeddings}`)
    const similarityResults = await Promise.all(embeddings.map(async (doc) => {
        const similarity = await cosineSimilarityPython(userEmbedding, doc.embeddings);
        console.log(`Este sería similarity ${similarity}`)
        return { document: doc.document, similarity };
    }));

    return similarityResults;
}

module.exports = compareWithEmbeddings;
