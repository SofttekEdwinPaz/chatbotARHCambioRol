const {addKeyword} = require('@bot-whatsapp/bot')
const delay = (ms) => new Promise((resolve) => setTimeout(resolve,ms)) //Sintáxis para generar un tiempo de espera entre respuestas.
const flowAPIJIRA_RevisarTicket = require('./flowAPIJIRA_RevisarTicket');


const Area2 = addKeyword('3SKDDOrjhnadsadsf').addAnswer(
    [
        'Por favor, proporcióname el ticket o código 🎫 del cual deseas revisar la información 📋.\n\nPresiona 0️⃣ para volver al menú principal 🔙'
    ],
    {
        capture:true,
        delay:1000
    },
    async (ctx,{state,gotoFlow,flowDynamic,endFlow}) =>{
        if(ctx.body === '0'){
            return endFlow('❌ Su solicitud ha sido cancelada\n\nRecuerda que estoy aquí para ayudarte en cualquier momento. No dudes en saludarme nuevamente cuando lo desees o necesites asistencia.')
        }
        
        await state.update({keyTicketJira:ctx.body.toUpperCase()})
        flowDynamic('Gracias 👌, procederé a consultar el estado de tu ticket, espera un momento. ⌛')
        await delay(2000)
        await gotoFlow(flowAPIJIRA_RevisarTicket)
    }
)

module.exports = Area2