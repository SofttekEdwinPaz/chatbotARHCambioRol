const {addKeyword} = require('@bot-whatsapp/bot')
const delay = (ms) => new Promise((resolve) => setTimeout(resolve,ms)) //Sintáxis para generar un tiempo de espera entre respuestas.


//Flujo Vacaciones
const Area1 = addKeyword(['2SKDDOrjhnadsadsf']).addAction(
    [
        'Este flujo se encuentra en desarrollo.'
    ],
    async (ctx, {state,gotoFlow,endFlow}) =>{
        if(ctx.body === '0'){
            return endFlow('❌ Su solicitud ha sido cancelada')
        }
        return endFlow('❌ Este flujo se encuentra en desarrollo.')
    }
)

module.exports = Area1