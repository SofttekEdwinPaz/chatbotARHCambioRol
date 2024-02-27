const {addKeyword} = require('@bot-whatsapp/bot')
const delay = (ms) => new Promise((resolve) => setTimeout(resolve,ms)) //Sintáxis para generar un tiempo de espera entre respuestas.


//Flujo Vacaciones
const Area1 = addKeyword(['2SKDDOrjhnadsadsf']).addAction(
    [
        'Este flujo se encuentra en desarrollo.'
    ],
    async (ctx, {state,gotoFlow,endFlow}) =>{
        if(ctx.body === '0'){
            return endFlow('❌ Su solicitud ha sido cancelada\n\nRecuerda que estoy aquí para ayudarte en cualquier momento. No dudes en saludarme nuevamente cuando lo desees o necesites asistencia.')
        }
        return endFlow('❌ Este flujo se encuentra en desarrollo.\n\nRecuerda que estoy aquí para ayudarte en cualquier momento. No dudes en saludarme nuevamente cuando lo desees o necesites asistencia.')
    }
)

module.exports = Area1