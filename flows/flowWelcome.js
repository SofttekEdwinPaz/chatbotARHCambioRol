const {addKeyword, EVENTS} = require('@bot-whatsapp/bot')
const Reglas = require('./flowReglas')
const Area1 = require('./flowArea1')
const Area2 = require('./flowArea2')
const flowGracias = require('./flowGracias')
const flowIA = require('./flowIA')
const delay = (ms) => new Promise((resolve) => setTimeout(resolve,ms)) //Sintáxis para generar un tiempo de espera entre respuestas.
// const flowGracias = require('./flows/flowGracias')

/**
 * Punto de entrada (Todos los mensajes llegan aca. (los que no se activen por una palabra clave))
 * FLUJO de Bienvenida.
 */

const botActivo = true

// module.exports = addKeyword(EVENTS.WELCOME).addAction(async (ctx, {flowDynamic, gotoFlow, fallBack }) => {
//     gotoFlow(flowReglas)
// });
const Welcome = addKeyword(EVENTS.WELCOME).addAction(async (_, { flowDynamic }) => {
    const msg = [        
        '¡Hola 👋, Softtekian! Mi nombre es *TAPI*, tu asistente virtual 🤖 ¿En qué te puedo ayudar 🆘 el día de hoy?',
        '1️⃣ *Cambio de Rol*',
        '2️⃣ *Vacaciones (En desarrollo)*',
        '3️⃣ *Revisar ticket*',
        '4️⃣ *Cancelar*'
    ];
    flowDynamic(msg.join("\n"));
}).addAction(
    {
        capture: true
    },
    async (ctx, {state, fallBack, flowDynamic, endFlow, gotoFlow}) => {
        console.log('Ping Bot Activo_FlujoBasadoEnReglas: ', botActivo)
        const numeroValido = /^\d+$/.test(ctx.body) ? parseInt(ctx.body) : NaN;
        console.log(numeroValido)

        if (!isNaN(numeroValido) && numeroValido >= 1 && numeroValido <= 4) {
            if (numeroValido === 1) {
                console.log('Cambio de Rol');
                await gotoFlow(Reglas)
            } else if (numeroValido === 2) {
                console.log('Vacaciones (En desarrollo)');
                await gotoFlow(Area1)
            } else if (numeroValido === 3) {
                console.log('Revisar ticket');
                await gotoFlow(Area2)
            } else if (numeroValido === 4) {
                console.log('Cancelar');
                await gotoFlow(flowGracias)
            }
        } else {
            console.log('Número no válido');
            await flowDynamic('❌ Opción no válida\n\nSeleccione entre las opciones disponibles.')
            return fallBack();
        }
    }
)


module.exports = Welcome

/**
 * La función de abajo contiene el mensaje inicial de Welcome con IA
 */

// module.exports = addKeyword(EVENTS.WELCOME).addAction(async (ctx, {flowDynamic, gotoFlow, fallBack }) => {
//     gotoFlow(flowIA)
// });









