// const express = require('express');
const {addKeyword} = require('@bot-whatsapp/bot')
const exportarAExcel = require('../utils/exportarAExcel')
const verificaLiderYCorreo = require('../utils_BasadoNReglas/verificaLiderYCorreo');
const xlsx = require('xlsx');
const delay = (ms) => new Promise((resolve) => setTimeout(resolve,ms)) //Sintáxis para generar un tiempo de espera entre respuestas.
const flowGracias = require('./flowGracias')

//Se obtiene la fecha actual de la solicitud
const fechaActual = new Date();
const dia = String(fechaActual.getDate()).padStart(2, '0');
const mes = String(fechaActual.getMonth() + 1).padStart(2, '0'); // Enero es 0
const año = fechaActual.getFullYear();
const fechaNovedad = dia + '-' + mes + '-' + año;
//Dirección donde se encuentran los líderes autorizados
// const filePath = 'C:\\Users\\edwin.paz\\Desktop\\ChatBot_ARH_Softtek\\Documentos\\AMS_aplicaciones.xlsx';

/**
 * Falta hacer el flujo de apagado para que luego de pasado un tiempo IDLE, quede ok.
 * 
 * flowApagado()
 * 
 */

/** */
// const app = express();
// console.log('este sería el uso de Express API app_Express: ', app)
const ListaConsultores = 'C:\\Users\\edwin.paz\\Desktop\\ChatBot_ARH_Softtek\\Documentos\\Listado de Consultores.xlsx';

function findConsultantName(filePath, isCode) {

    /**
     * Función encargada de revisar si existe el IS en la empresa. Se utiliza el archivo de excel
     * Listado de Consultores.xlsx. LO IDEAL ES CAMBIAR A UN LISTADO COMPLETO DE CONSULTORES de toda la empresa.
     * 
     * Ya se tiene listado completo de consultores.
     */
  // Leer el archivo Excel
  const workbook = xlsx.readFile(filePath);
  const sheetName = workbook.SheetNames[1];
  const sheet = workbook.Sheets[sheetName];

  // Convertir la hoja de cálculo en JSON
  const data = xlsx.utils.sheet_to_json(sheet);
  
  // Convertir el IS a mayúsculas
  const isCodeUpper = isCode.toUpperCase();

  let consultant;
  
  try {
    consultant = data.find(row => row.IsColaborador === isCodeUpper);
    if (!consultant) {
        throw new Error('IS no encontrado');
    }} 
    catch (error) {
        console.error('Error:', error.message);
        consultant = null;
    }

    // Verificar si 'consultant' es un objeto antes de intentar acceder a sus propiedades
    if (consultant && typeof consultant === 'object') {
        console.log("Este sería el nombre completo del usuario", consultant['Nombre']);
        return consultant.Nombre;
    } else {
        console.log('No se encontró el IS.');
        return 'No se encontró el IS.';
    }
}


const Reglas = addKeyword(['1SKDDOrjhnadsadsf']).addAnswer(
    [
        'Para iniciar ▶️ con tu solicitud, ¿me podrías proporcionar tu IS, por favor?\n\nPresiona 0️⃣ para volver al menú principal 🔙',
    ],
    {capture:true},
    async (ctx, {state,gotoFlow,flowDynamic, endFlow}) =>{
        const ISLider = ctx.body
        if(ISLider === '0'){
            return endFlow('❌ Su solicitud ha sido cancelada')
        }
        const IS = ctx.body.toUpperCase()
        await state.update({IS:IS})
        const numeroCelular = ctx.from
        await state.update({numeroCelular:numeroCelular})
        console.log(`Este es tú IS y número de celular: ${IS} - ${numeroCelular}`)
        const msgISLider =     [            
            '✔️¡Listo! Adicionalmente, ¿podrías proporcionarme tu correo 📧 de Softtek?\n\nPresiona 0️⃣ para volver al menú principal 🔙',        
        ]
        await flowDynamic(msgISLider)
    }
).addAction(
    {
        capture:true
    },
    async (ctx, {state,gotoFlow,fallBack,flowDynamic,endFlow}) =>{
        if(ctx.body === '0'){
            return endFlow('❌ Su solicitud ha sido cancelada')
        }
        const correoLider = ctx.body.toLowerCase();
        if(!correoLider.includes('@softtek.com')){ //Se verifica si ingreso una dirección de email válida. En caso contrario, se le consulta nuevamente.
            return fallBack()
        }
        await state.update({correoLider})
        const myState = state.getMyState()
        console.log(`Este es tú correoLider y número de celular: ${myState.correoLider} - ${myState.numeroCelular}`)
        const resultado = verificaLiderYCorreo(myState.IS,myState.correoLider,ListaConsultores)
        const autorizado = resultado.respuesta
        //Se formatea lista de líderes para ser enviada por msj
        const listaLideres = JSON.stringify(resultado.lideresUnicos)
        const listaFormatoBullet = JSON.parse(listaLideres).map(lider => `• ${lider}`).join('\n');
        console.log(listaFormatoBullet);
        console.log(`Está autorizado o no para solicitar cambio: ${autorizado}`)

        if (autorizado === 'Lista de líderes') {
            console.log("Lo detectó como lista de líderes")
            await flowDynamic(`⛔ Desafortunadamente, no te encuentras autorizado para realizar esta solicitud. Por favor, contacta a tu líder disponible:\n ${listaFormatoBullet} \n\npara más información.📋`);
            // await delay(1000)
            return gotoFlow(flowGracias);
        } else if (autorizado === 'Agregó mal la información') {
            console.log("Lo detectó como Agregó mal la información")
            await flowDynamic(`⛔ Desafortunadamente, no agregaste la información🗒️ correcta para realizar esta solicitud.`);
            // await delay(1000)
            return gotoFlow(flowGracias);
        } else if (autorizado === 'Accede') {
            console.log("Lo detectó como Accede")
            console.log(`Estás autorizado a realizar solicitud de cambio de rol ✔️`);
            await flowDynamic('¡Perfecto! Te encuentras autorizado ✔️ para realizar la solicitud de cambio de rol.\n');
            // await delay(1000)
            const msgISSofttekian =     [
                '¿Podrías proporcionarnos el IS del Softtekian que requiere el cambio de rol?\n\nPresiona 0️⃣ para volver al menú principal 🔙',
            ]
            await flowDynamic(msgISSofttekian)
            console.log("Nos dirigimos a verificar información.")
        }
        
    }
).addAction(
    {
        capture:true
    
    },
    async (ctx,{state,gotoFlow,flowDynamic,endFlow,fallBack})=>{
        const ISSofttekian = ctx.body
        console.log("Revisando si La información ingresada por usuario: ",ISSofttekian," existe en nuestra BD o si cancel.")        
        if(ISSofttekian === '0'){
            return endFlow('❌ Su solicitud ha sido cancelada')
        }
        const nombreEmpleado = findConsultantName(ListaConsultores, ISSofttekian)
        if (nombreEmpleado === 'No se encontró el IS.'){
            return fallBack('Lo siento 😧, el IS al cual se le intenta realizar el cambio de rol no existe 🙅‍♀️, ingresa nuevamente el IS.\n\nPresiona 0️⃣ para volver al menú principal 🔙')
        }
        await state.update({ISEmpleado:ISSofttekian.toUpperCase()})
        await state.update({nombreEmpleado:nombreEmpleado.toUpperCase()})
        const msg_RolActual = [            
            '¿Cuál es el rol actual del Softtkekian?\n\nPresiona 0️⃣ para volver al menú principal 🔙',        
        ]
        await flowDynamic(msg_RolActual)
    }
).addAction(
    {
        capture:true
    },
    async (ctx,{state,gotoFlow,endFlow,flowDynamic})=>{
        if(ctx.body === '0'){
            return endFlow('❌ Su solicitud ha sido cancelada')
        }
        await state.update({rolActualEmpleado:ctx.body})
        const msg_NuevoRolSofttekian = ['¿Cuál será el nuevo rol del Softtekian?\n\nPresiona 0️⃣ para volver al menú principal 🔙']
        await flowDynamic(msg_NuevoRolSofttekian)
    }
).addAction(
    {
        capture:true
    },
    async (ctx,{state,gotoFlow,endFlow,flowDynamic})=>{
        if(ctx.body === '0'){
            return endFlow('❌ Su solicitud ha sido cancelada')
        }
        await state.update({rolNuevoEmpleado:ctx.body})
        const msg_SeniorityIS =     [
            'En caso de aplicar, ¿podrías indicarme el seniority del Softtekian  que será asignado al nuevo rol?\nDe no aplicar, por favor, escribe no aplica.\n\nPresiona 0️⃣ para volver al menú principal 🔙',
        ]
        await flowDynamic(msg_SeniorityIS)
    }
).addAction(
    {
        capture:true
    },
    async (ctx,{state,gotoFlow,endFlow,flowDynamic})=>{
        if(ctx.body === '0'){
            return endFlow('❌ Su solicitud ha sido cancelada')
        }
        await state.update({ISSeniority:ctx.body})
    }
).addAction(
    async (_,{state, flowDynamic,gotoFlow}) => {
        const myState = state.getMyState()
        console.log(`Este es mi estado de información: ${JSON.stringify(myState,null,2)}`)
        // exportarAExcel(myState) //REVISAR BIEN ESTA FUNCIÓN.
        console.log('Procedemos a enviar el mensaje con los datos al usuario.')
        await flowDynamic(`
        Los datos recopilados por *TAPI* para solicitud de cambio de rol son: \n
        - Fecha de la novedad: ${fechaNovedad}
        - IS del líder: ${myState.IS}
        - IS del Softtekian: ${myState.ISEmpleado}
        - Rol actual del Softtekian: ${myState.rolActualEmpleado.toUpperCase()}
        - Nuevo rol del Softtekian: ${myState.rolNuevoEmpleado}
        - Seniority del Softtekian (si aplica): ${myState.ISSeniority}        
        Por favor, espera un momento mientras creamos el ticket.
        `)
        return gotoFlow(require('./flowAPIJira'))
    }
)

// const FlujosBasadosRegla = addKeyword('T3e direcciona4mos hacia el flujo basado en reglas',).addAnswer(
//     [
//         '¡Hola, Softtekian! Mi nombre es TAPI, tu asistente virtual ¿En qué te puedo ayudar el día de hoy?',
//         '1. *Cambio de Rol*',
//         '2. *Vacaciones (En desarrollo)*',
//         '3. *Revisar ticket*',
//         '4. *Cancelar*'
//     ],
//     {
//         capture:true,
//     },
//     // null,
//     async (ctx,{gotoFlow,flowDynamic,fallBack, endFlow})=>{
//         console.log('Ping Bot Activo_FlujoBasadoEnReglas: ',botActivo)
//         const numeroValido = ctx.body
//         console.log(numeroValido)
//         switch (numeroValido) {
//             case '1':
//                 gotoFlow(Reglas);
//                 break;
//             case '2':
//                 gotoFlow(Area1);
//                 break;
//             case '3':
//                 gotoFlow(Area2);
//                 break;
//             case '4':
//                 gotoFlow(flowGracias);
//                 break;
//             default:
//                 console.log("Elegiste mal la opción");
//                 flowDynamic("Opción errónea.")
//                 return fallBack();
//         }        
//     },
// )


module.exports = Reglas