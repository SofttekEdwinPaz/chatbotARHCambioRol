const {addKeyword} = require('@bot-whatsapp/bot')
const axios = require('axios').default
const delay = (ms) => new Promise((resolve) => setTimeout(resolve,ms)) //Sintáxis para generar un tiempo de espera entre respuestas.

// const url = 'https://fakestoreapi.com/products'
/**
 * Pruebas
 */
const url = 'https://rpa-pruebas.atlassian.net/rest/api/2/issue/'
const keyProject = 'PDP'

/**
 * Productivo
 */
// const keyProject = 'ACDR' //Original
// const url = 'https://softtekco.atlassian.net/rest/api/2/issue/' //Original



const flowGracias = addKeyword(['No','2']).addAnswer(
    [
        'Ha sido un placer ayudarte. 🦾\n',
        'Recuerda que puedes comunicarte conmigo en cualquier momento.*TAPI* te desea un feliz día. 🤖 ',
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

const flowAPIJira = addKeyword('APPII').addAction(async (ctx,{state,flowDynamic,gotoFlow})=>{
    console.log('Ingresamos a la función de request a la API de Jira.')
    
    const myState = state.getMyState()
    const nombreEmpleadoMayuscula = myState.nombreEmpleado
    const ISEmpleadoMayuscula = myState.ISEmpleado
    
    const descripcionIssue = `Solicitante: Líder con IS ${myState.IS}\n` +
    `Empleado Afectado: IS ${ISEmpleadoMayuscula}\n` +
    `Cargo Actual del Empleado: ${myState.rolActualEmpleado}\n` +
    `Nuevo Cargo Propuesto: ${myState.rolNuevoEmpleado}\n\n` +
    `Se solicita un cambio de rol para el Softtekian ${nombreEmpleadoMayuscula} mencionado, ajustando así sus responsabilidades y perfil del cargo a las necesidades actuales del equipo.`;
    const cabecera = {
        'Authorization': `Basic ${Buffer.from(
            'edwin.paz@softtek.com:ATATT3xFfGF05nDSOuG2yiwhLY2V7CP7qIcGnDm2yH5VcUcUl5bDfscX9XpLcgAGw_TzbAc-m8xk8GM6tUelATdJBpZiueWirjBE_toQvgfSwj9mkLdB91S4j6L-PjfI24n4X5YJE_8KwxmywuOcxYsa7ggqgOIfUzB2vJMYODkkc8WZOs0Ucbg=9B15E685').toString('base64')}`,
            'Accept':'application/json',
            'Content-Type':'application/json'
    }

    const body= JSON.stringify({
        "fields":{
            "project":{
                "key":keyProject
            },
            "summary":"Solicitud cambio de rol",
            "description": descripcionIssue,
            "issuetype":{
                "name":"Task"//"id":"10001"                
            }
        },
        "reporter":{
            "name":"Edwin Paz"
        }
    })
    const respuesta = axios.post(url,body,{headers:cabecera})
    respuesta.then(response => {
    console.log('Ticket creado: ', response.data)
    return response.data;
}).then(data=>{
    return flowDynamic(`
    Este es tu ticket 🎫: ${data.key}\n\n
    ¿Deseas realizar una solicitud nueva?
    1️⃣ *Si*.
    2️⃣ *No*.
    `)
})
}).addAction(
    {
        capture:true,
    },
    async (ctx,{state,gotoFlow,endFlow,flowDynamic})=>{
        const NuevaSolicitud = ctx.body
        if(NuevaSolicitud === '1' || NuevaSolicitud === 'si' || NuevaSolicitud === 'Si' || NuevaSolicitud === 'Sí' || NuevaSolicitud === 'SÍ' || NuevaSolicitud === 'SI'){
            return gotoFlow(flowReset)
        } else if (NuevaSolicitud === '2' || NuevaSolicitud === 'no' || NuevaSolicitud === 'No' || NuevaSolicitud === 'NO'){
            return gotoFlow(flowGracias)
        }
    }
)

module.exports = flowAPIJira