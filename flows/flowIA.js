const {addKeyword} = require('@bot-whatsapp/bot')
const OpenAI = require('openai')
const flowChangeRol = require('./flowChangeRol')
const openai = new OpenAI()

const flowGracias = addKeyword(['No','4','Cancelar','0']).addAnswer(
    [
        'Ha sido un placer asistirle. Si necesita más ayuda en el futuro, no dude en contactarnos. Le deseamos un excelente día. Atentamente, *TAPI*.',
    ]
)

const content = `
[Tarea]: Clasifica el mensaje entrante en diferentes categorías como: ARH, ERP, AMS, General.
[Instrucciones]: El modelo debe clasificar el mensaje basado en su contenido.
[Prompt formula]: Aplica clasificación de texto en el siguiente mensaje del usuario y clasifícalo en diferentes categorías como: ARH, ERP, AMS, General. Utiliza los siguientes ejemplos como guía:
ARH: "¿Cómo puedo solicitar días libres?" o "Necesito información sobre la política de vacaciones o ¿Puedo solicitar cambio de rol? o Cambio de rol, incapacidades, días de familia, maternidad."
ERP: "¿Cómo puedo acceder al sistema de gestión de inventario?" o "Necesito ayuda con el software de facturación."
AMS: "Tengo un problema con la aplicación móvil, no carga correctamente." o "Necesito actualizar la aplicación de seguimiento de tiempo."
General: "¿Dónde puedo encontrar información sobre la empresa?" o "Necesito ayuda con un problema no relacionado con los sistemas internos."
[Respuesta del bot]: El bot debe ser capaz de identificar la categoría basándose en el contenido del mensaje del usuario. Por ejemplo, si el usuario pregunta "¿Cómo accedo a mi plan de beneficios o maternidad?", el bot debería clasificar esto como ARH.
`

const clasificadorMensajeInicial = async(mensajeEntrante) => {
    const completion = await openai.chat.completions.create({
        messages: [
            { "role": "system", "content": content },
            // { "role": "system", "content": "Eres un chatbot amable, encargado de preguntarle al usuario si quiere utilizar o no IA." },
            {"role": "user", "content": mensajeEntrante}
        ],
        model: "gpt-3.5-turbo",
        max_tokens:90
    })
    console.log(completion.choices[0].message.content)
    return completion.choices[0].message.content
}


const flowIA = addKeyword('IA_NLP_CV').addAnswer(
    [
        '¡Saludos! Soy *TAPI*, tu asistente virtual. ¿Cómo puedo ayudarte hoy?',
        'Estoy aquí para informarte sobre diversos temas, incluyendo:',
        '   - Incapacidades laborales',
        '   - Licencias de maternidad',
        '   - Solicitudes de vacaciones',
        '   - Permisos por matrimonio',
        '   - Días de descanso compensatorios',
        '   - Celebración de cumpleaños',
        '',
        'Si tienes alguna consulta sobre estos temas o cualquier otro asunto, no dudes en preguntar.',
        'Si deseas finalizar o salir de esta conversación, puedes hacerlo en cualquier momento presionando 0.'
    ],    
    {
        capture:true
    },
    null
)
.addAction(async (ctx, {state, gotoFlow, flowDynamic,fallBack}) => {
    const mensajeEntrante = ctx.body;
    if(mensajeEntrante=='0'){
        return gotoFlow(flowGracias)
    }
    await state.update({mensajeEntrante: mensajeEntrante});
    const categoria = String(await clasificadorMensajeInicial(mensajeEntrante)).trim();
    console.log(`Se clasificó el mensaje entrante en: ${categoria}`);

    if(categoria == 'General') {
        await flowDynamic(`Aún estamos trabajando en esta sección, pero me encantaría ayudarte en lo que pueda. ¿Hay algo más en lo que pueda asistirte?`);
        console.log('Manejando General');
        return fallBack("Consulta nuevamente.")
    } else if(categoria == 'ARH'){
        await flowDynamic(`Perfecto, vamos hacia el área de ARH.`);
        console.log('Manejando ARH');
        await gotoFlow(flowChangeRol);
    } else if(categoria == 'ERP'){
        await flowDynamic(`Excelente, entraremos en el tema de ERP. ¿Cómo puedo orientarte?`);
        console.log('Manejando ERP');
    } else if(categoria == 'AMS'){
        await flowDynamic(`Estamos listos para abordar asuntos de AMS. ¿Cuál es tu consulta?`);
        console.log('Manejando AMS');
    }
});

module.exports = flowIA;

