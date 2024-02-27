const {addKeyword, addAnswer} = require('@bot-whatsapp/bot')
const axios = require('axios').default

// const url = 'https://fakestoreapi.com/products'

/**
 * Pruebas
 */
const url_RevisarTicket = 'https://rpa-pruebas.atlassian.net/rest/api/2/issue/'
const keyProject = 'PDP'

/**
 * Productivo
 */
// const keyProject = 'ACDR' //Original
// const url_RevisarTicket = 'https://softtekco.atlassian.net/rest/api/2/issue/' //Original


const flowGracias = addKeyword(['No','2']).addAnswer(
    [
        'Ha sido un placer ayudarte. 🦾\n\nRecuerda que puedes comunicarte conmigo en cualquier momento.*TAPI* te desea un feliz día. 🤖',
    ]
    )


const flowReset = addKeyword(['Si','1']).addAnswer(
    [
        'Has decidido iniciar una nueva solicitud.😇\n',
        'Por favor escribe *Hola*'

    ],
    null,
    null
)


const flowAPIJIRA_RevisarTicket = addKeyword('APPII_RevisarTicket')
.addAction(async (ctx,{state,flowDynamic,endFlow})=>{
    console.log('Ingresamos a la función de request a la API de Jira.');
    const myState = state.getMyState();
    const keyMayuscula = myState.keyTicketJira
    const url = url_RevisarTicket + keyMayuscula;
    const cabecera = {
        'Authorization': `Basic ${Buffer.from(
            'edwin.paz@softtek.com:ATATT3xFfGF05nDSOuG2yiwhLY2V7CP7qIcGnDm2yH5VcUcUl5bDfscX9XpLcgAGw_TzbAc-m8xk8GM6tUelATdJBpZiueWirjBE_toQvgfSwj9mkLdB91S4j6L-PjfI24n4X5YJE_8KwxmywuOcxYsa7ggqgOIfUzB2vJMYODkkc8WZOs0Ucbg=9B15E685').toString('base64')}`,
            'Accept':'application/json'
    };
    axios.get(url, { headers: cabecera }).then(async (response) => {
        // Acceder al estado del issue
        const estado = response.data.fields.status.name;
    
        // Acceder al asignado (Assignee)
        const asignado = response.data.fields.assignee ? response.data.fields.assignee.displayName : 'No asignado';
    
        // Acceder al tiempo estimado y registrado
        const tiempoEstimado = response.data.fields.timetracking.originalEstimate || 'No especificado';
        const tiempoRegistrado = response.data.fields.timetracking.timeSpent || 'No registrado';
    
        // Acceder a la última fecha de actualización
        const fechaActualizacion = response.data.fields.updated || 'No disponible';
    
        // Acceder al texto del primer comentario, si existe
        let textoComentario = '';
        if (response.data.fields.comment && response.data.fields.comment.length > 0) {
            textoComentario = response.data.fields.comment[0].body.content[0].content[0].text;
        }else{textoComentario = 'No hay comentarios'};
    
        // Formatear el mensaje
        const mensaje = `*Estado del Ticket ${keyMayuscula} 🎫*: ${estado}\n` +
                        `*Asignado a 👩‍💼👨‍💼*: ${asignado}\n` +
                        `*Tiempo Estimado ⌛*: ${tiempoEstimado}\n` +
                        `*Tiempo Registrado ⌛*: ${tiempoRegistrado}\n` +
                        `*Última Actualización 🆙*: ${fechaActualizacion}\n` +
                        `*Comentario*: ${textoComentario}\n\n`+
                        `Ha sido un placer ayudarte. 🦾\n\nRecuerda que puedes comunicarte conmigo en cualquier momento.*TAPI* te desea un feliz día. 🤖`;
    
        // console.log(mensaje);
    
        // Continuar con el flujo de trabajo
        await flowDynamic("Información del ticket 📋:\n\n" + mensaje)
        // .then(()=>{
        //     addAnswer(
        //         [
        //             '¿Deseas realizar una solicitud nueva?',
        //             '1. *Si*',
        //             '2. *No*'
        //         ],
        //         {
        //             capture:true,
        //         },
        //         null,
        //         [flowGracias,flowReset]
            
        //     )
        // });
    }).catch((error)=>{
        console.error("Se produjo un error en la solicitud: ", error)
        flowDynamic("El ticket o código 🎫 enviado no existe 🚫, por favor verificar y realizar nuevamente la solicitud.")
        return endFlow()
    })
})


module.exports = flowAPIJIRA_RevisarTicket