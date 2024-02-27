require('dotenv').config()
const {init} = require('bot-ws-plugin-openai')

/**
 * Configuración del plugin
 */
const configuracionEmpleadosOpenai = {
    model:"gpt-3.5-turbo-16k",
    temperature:0.3,
    apiKey: process.env.OPENAI_API_KEY
}

module.exports = init(configuracionEmpleadosOpenai)