const reiniciarTimerInactividad = () => {
    // Reiniciar el temporizador
    clearTimeout(inactividadTimer);
    iniciarTimerInactividad();
  };
  
  const iniciarTimerInactividad = () => {
    // Establecer el temporizador de inactividad
    inactividadTimer = setTimeout(() => {
      botActivo = false;
      console.log('Bot apagado automáticamente debido a inactividad.');
    }, INACTIVIDAD_TIMEOUT);
  };