/**
 * Utilidades para manejo de fechas en la aplicación del clima
 */

/**
 * Normaliza una fecha a medianoche en la zona horaria local
 * @param dateString - Fecha en formato YYYY-MM-DD
 * @returns Fecha normalizada a medianoche local
 */
export function normalizeDateToLocal(dateString: string): Date {
  // Crear fecha directamente en zona horaria local
  const [year, month, day] = dateString.split('-').map(Number);
  return new Date(year, month - 1, day); // month - 1 porque Date usa 0-indexado
}

/**
 * Obtiene la fecha actual del dispositivo en formato YYYY-MM-DD
 * @returns Fecha actual en formato string
 */
export function getCurrentDateString(): string {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

/**
 * Obtiene la fecha de hoy normalizada a medianoche
 * @returns Fecha de hoy a medianoche
 */
export function getTodayNormalized(): Date {
  const today = new Date();
  return new Date(today.getFullYear(), today.getMonth(), today.getDate());
}

/**
 * Calcula la diferencia en días entre dos fechas
 * @param date1 - Primera fecha
 * @param date2 - Segunda fecha
 * @returns Diferencia en días (positiva si date1 es posterior)
 */
export function getDaysDifference(date1: Date, date2: Date): number {
  const diffTime = date1.getTime() - date2.getTime();
  return Math.round(diffTime / (1000 * 60 * 60 * 24));
}

/**
 * Determina si una fecha es hoy
 * @param dateString - Fecha en formato YYYY-MM-DD
 * @returns true si es hoy, false en caso contrario
 */
export function isToday(dateString: string): boolean {
  const currentDate = getCurrentDateString();
  return dateString === currentDate;
}

/**
 * Determina si una fecha es mañana
 * @param dateString - Fecha en formato YYYY-MM-DD
 * @returns true si es mañana, false en caso contrario
 */
export function isTomorrow(dateString: string): boolean {
  const today = new Date();
  const tomorrow = new Date(today);
  tomorrow.setDate(today.getDate() + 1);
  
  const tomorrowString = `${tomorrow.getFullYear()}-${String(tomorrow.getMonth() + 1).padStart(2, '0')}-${String(tomorrow.getDate()).padStart(2, '0')}`;
  
  return dateString === tomorrowString;
}

/**
 * Determina si una fecha es ayer
 * @param dateString - Fecha en formato YYYY-MM-DD
 * @returns true si es ayer, false en caso contrario
 */
export function isYesterday(dateString: string): boolean {
  const today = new Date();
  const yesterday = new Date(today);
  yesterday.setDate(today.getDate() - 1);
  
  const yesterdayString = `${yesterday.getFullYear()}-${String(yesterday.getMonth() + 1).padStart(2, '0')}-${String(yesterday.getDate()).padStart(2, '0')}`;
  return dateString === yesterdayString;
}

/**
 * Formatea una fecha para mostrar en la interfaz
 * @param dateString - Fecha en formato YYYY-MM-DD
 * @param isToday - Si es hoy (para mostrar "Hoy")
 * @returns Texto formateado para mostrar
 */
export function formatForecastDate(dateString: string, isToday: boolean = false, isTomorrowParam: boolean = false): string {
  // Si ya sabemos que es hoy, devolver directamente
  if (isToday) {
    return 'Hoy';
  }

  // Si ya sabemos que es mañana, devolver directamente
  if (isTomorrowParam) {
    return 'Mañana';
  }

  // Verificar si es mañana usando la función isTomorrow
  if (isTomorrow(dateString)) {
    return 'Mañana';
  }

  // Verificar si es ayer usando la función isYesterday
  if (isYesterday(dateString)) {
    return 'Ayer';
  }

  // Para otros días, formatear la fecha
  const forecastDate = new Date(dateString + 'T00:00:00');
  return forecastDate.toLocaleDateString('es-ES', { 
    weekday: 'short',
    day: 'numeric',
    month: 'short'
  });
}

/**
 * Debug: Muestra información de fechas para debugging
 * @param dateString - Fecha en formato YYYY-MM-DD
 * @param context - Contexto para el log (ej: "Pronóstico", "Detalles")
 */
export function debugDateInfo(dateString: string, context: string = 'Fecha'): void {
  const currentDate = getCurrentDateString();
  const deviceTime = new Date();
  
  console.log(`🗓️ ${context}:`, {
    forecastDate: dateString,
    currentDate: currentDate,
    isToday: isToday(dateString),
    isTomorrow: isTomorrow(dateString),
    isYesterday: isYesterday(dateString),
    deviceTime: deviceTime.toLocaleString('es-ES'),
    deviceDate: deviceTime.getDate(),
    deviceMonth: deviceTime.getMonth() + 1,
    deviceYear: deviceTime.getFullYear(),
    deviceDayOfWeek: deviceTime.toLocaleDateString('es-ES', { weekday: 'long' })
  });
}
