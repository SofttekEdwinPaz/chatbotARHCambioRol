const XLSX = require('xlsx');

function exportarAExcel(datos, rutaArchivo = 'Datos.xlsx') {
  console.log('Iniciando función exportarAExcel.');
  try {
    console.log('Creando o leyendo el workbook.');

    let workbook;
    try {
      // Intenta leer el archivo existente
      console.log('Intentando leer el archivo existente:', rutaArchivo);
      workbook = XLSX.readFile(rutaArchivo);
      console.log('Archivo existente leído con éxito.');
    } catch (e) {
      // Si el archivo no existe, crea uno nuevo
      console.log('El archivo no existe, creando uno nuevo.');
      workbook = XLSX.utils.book_new();
    }

    console.log('Manejando la hoja de trabajo.');
    let worksheet = workbook.Sheets[workbook.SheetNames[0]] || XLSX.utils.aoa_to_sheet([]);
    console.log('Hoja de trabajo seleccionada o creada.');

    // Encuentra la última fila llena
    const ultimaFila = worksheet['!ref'] ? XLSX.utils.decode_range(worksheet['!ref']).e.r + 1 : 0;
    console.log('Última fila llena encontrada en:', ultimaFila);

    // Convierte las claves del objeto en cabeceras si el archivo es nuevo
    if (ultimaFila === 0) {
      console.log('El archivo es nuevo, agregando cabeceras.');
      const cabeceras = Object.keys(datos);
      XLSX.utils.sheet_add_aoa(worksheet, [cabeceras], { origin: 'A1' });
    }

    console.log('Procesando los datos a agregar.');
    // Convierte los datos del objeto a formato de fila de Excel
    const nuevaFila = Object.keys(datos).map(key => datos[key]);

    // Agrega la nueva fila al worksheet
    XLSX.utils.sheet_add_aoa(worksheet, [nuevaFila], { origin: ultimaFila ? { r: ultimaFila, c: 0 } : 'A2' });

    // Guarda el workbook
    console.log('Guardando el workbook.');
    workbook.Sheets[workbook.SheetNames[0] || 'Hoja1'] = worksheet;
    XLSX.writeFile(workbook, rutaArchivo);
    console.log('Archivo Excel guardado exitosamente.');
  } catch (e) {
    console.error('Error al exportar a Excel:', e);
  }
}

module.exports = exportarAExcel;
