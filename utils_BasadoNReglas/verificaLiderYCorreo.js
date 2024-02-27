const xlsx = require('xlsx');
const delay = (ms) => new Promise((resolve) => setTimeout(resolve,ms)) //Sintáxis para generar un tiempo de espera entre respuestas.

const verificaLiderYCorreo = (isLider, correoLider, filePath) => {
    const workbook = xlsx.readFile(filePath);
    const sheetName = workbook.SheetNames[1]; // Asegúrate de que este es el nombre correcto de la hoja
    const worksheet = workbook.Sheets[sheetName];
    const registros = xlsx.utils.sheet_to_json(worksheet);

    let coincidencia = false;
    const lideresSet = new Set();
    console.log("isLider",isLider)
    console.log("correoLider",correoLider)

    registros.forEach(registro => {
        if (registro['IS Lider'] === isLider && registro['Mail Lider'] === correoLider) {
            coincidencia = true;
        }
        if (registro['Lider']) {
            lideresSet.add(registro['Lider']);
        }
    });

    const lideresUnicos = Array.from(lideresSet);
    let respuesta;

    if (coincidencia) {
        respuesta = 'Accede';
    } else {
        let isLiderPresente = registros.some(reg => reg['IS Lider'] === isLider);
        let correoLiderPresente = registros.some(reg => reg['Mail Lider'] === correoLider);
        console.log("isLiderPresente",isLiderPresente)
        console.log("correoLiderPresente",correoLiderPresente)

        if ((isLiderPresente && !correoLiderPresente) || (!isLiderPresente && correoLiderPresente)) {
            respuesta = 'Agregó mal la información';
        } else {
            respuesta = 'Lista de líderes';
        }        
    }

    return { respuesta, lideresUnicos };
};

module.exports = verificaLiderYCorreo;
