const { createBot, createProvider, createFlow, addKeyword } = require('@bot-whatsapp/bot')

const QRPortalWeb = require('@bot-whatsapp/portal')
const BaileysProvider = require('@bot-whatsapp/provider/baileys')
const JsonFileAdapter = require('@bot-whatsapp/database/json')
const flowWelcome = require('./flows/flowWelcome')
const flowChangeRol = require('./flows/flowChangeRol')
const empleados = require('./empleados')
const flowIA = require('./flows/flowIA')
const flowReglas = require('./flows/flowReglas')
const flowAPIJira = require('./flows/flowAPIJira')
const flowAPIJIRA_RevisarTicket = require('./flows/flowAPIJIRA_RevisarTicket')
const flowArea1 = require('./flows/flowArea1')
const flowArea2 = require('./flows/flowArea2')
const flowGracias = require('./flows/flowGracias')


const main = async () => {
    const adapterDB = new JsonFileAdapter()
    const adapterFlow = createFlow([flowWelcome, flowChangeRol,flowReglas,flowIA,flowAPIJira,flowAPIJIRA_RevisarTicket,flowArea1,flowArea2,flowGracias])
    const adapterProvider = createProvider(BaileysProvider)

    const configBot = {
        flow: adapterFlow,
        provider: adapterProvider,
        database: adapterDB,
    }
    const configExtra = {
        extensions: {
            empleados
        }
    }

    createBot(configBot,configExtra)

    QRPortalWeb()
}
main()
