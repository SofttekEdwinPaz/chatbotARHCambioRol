/**
 * Función encargada de realizar limpieza y preprocesamiento al texto antes de hacerle embedding.
 */
function limpiarTexto(texto) {
  let textoLimpio = texto
    .replace(/\n\s*\n/g, '\n') // Eliminar líneas vacías
    .replace(/\s+/g, ' ')      // Eliminar espacios adicionales
    .replace(/s\.a\.\sde\sc\.v\./gi, '') // Eliminar referencias corporativas
    .replace(/©\s[\w\s.]+/gi, '') // Eliminar derechos de autor y similares
    .replace(/\.{2,}/g, '')   // Eliminar múltiples puntos seguidos
    .replace(/\d/g, '')       // Eliminar números, si es necesario
    .toLowerCase()            // Convertir a minúsculas
    .trim();                  // Eliminar espacios al inicio y final

  // Más reglas según sea necesario...

  return textoLimpio;
}

module.exports = limpiarTexto;