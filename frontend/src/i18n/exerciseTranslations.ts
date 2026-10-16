import type { Language } from './translations'

export const EXERCISE_TRANSLATIONS: Record<string, { es: string; en: string }> = {
  'Press de Banca': { es: 'Press de Banca', en: 'Bench Press' },
  'Press Inclinado con Mancuernas': { es: 'Press Inclinado con Mancuernas', en: 'Incline Dumbbell Press' },
  'Aperturas en Polea (Cruces)': { es: 'Aperturas en Polea (Cruces)', en: 'Cable Flyes' },
  'Flexiones de Pecho (Push-ups)': { es: 'Flexiones de Pecho (Push-ups)', en: 'Push-ups' },
  'Peso Muerto': { es: 'Peso Muerto', en: 'Deadlift' },
  'Remo con Barra': { es: 'Remo con Barra', en: 'Barbell Row' },
  'Dominadas': { es: 'Dominadas', en: 'Pull-ups' },
  'Jalón al Pecho': { es: 'Jalón al Pecho', en: 'Lat Pulldown' },
  'Remo en Polea Baja (Gironda)': { es: 'Remo en Polea Baja (Gironda)', en: 'Seated Cable Row' },
  'Sentadilla': { es: 'Sentadilla', en: 'Squat' },
  'Prensa': { es: 'Prensa', en: 'Leg Press' },
  'Gemelos en Máquina': { es: 'Gemelos en Máquina', en: 'Calf Raises' },
  'Peso Muerto Rumano': { es: 'Peso Muerto Rumano', en: 'Romanian Deadlift' },
  'Extensiones de Cuádriceps': { es: 'Extensiones de Cuádriceps', en: 'Leg Extensions' },
  'Curl Femoral Tumbado': { es: 'Curl Femoral Tumbado', en: 'Lying Leg Curl' },
  'Press Militar': { es: 'Press Militar', en: 'Overhead Press' },
  'Elevaciones Laterales': { es: 'Elevaciones Laterales', en: 'Lateral Raises' },
  'Face Pull (Pájaros en Polea)': { es: 'Face Pull (Pájaros en Polea)', en: 'Face Pull' },
  'Curl de Bíceps': { es: 'Curl de Bíceps', en: 'Bicep Curl' },
  'Extensiones de Tríceps': { es: 'Extensiones de Tríceps', en: 'Tricep Extensions' },
  'Martillo': { es: 'Martillo', en: 'Hammer Curl' },
  'Fondos en Paralelas': { es: 'Fondos en Paralelas', en: 'Parallel Bar Dips' },
  'Press Francés': { es: 'Press Francés', en: 'Skull Crushers' },
  'Plancha Abdominal': { es: 'Plancha Abdominal', en: 'Plank' },
  'Elevación de Piernas': { es: 'Elevación de Piernas', en: 'Leg Raises' },
  'Running': { es: 'Running', en: 'Running' },
  'Bici': { es: 'Bici', en: 'Cycling' },
  'Calentamiento': { es: 'Calentamiento', en: 'Warm Up' },
  'Calentamiento Dinámico': { es: 'Calentamiento Dinámico', en: 'Dynamic Warm Up' },
  'Estiramiento': { es: 'Estiramiento', en: 'Stretching' },
  // Deportes
  'Fútbol': { es: 'Fútbol', en: 'Soccer' },
  'Básquet': { es: 'Básquet', en: 'Basketball' },
  'Pádel': { es: 'Pádel', en: 'Padel' },
  'Voley': { es: 'Voley', en: 'Volleyball' },
  'Handball': { es: 'Handball', en: 'Handball' },
  'Hockey': { es: 'Hockey', en: 'Hockey' },
  'Natación': { es: 'Natación', en: 'Swimming' }
}

export const EXERCISE_ID_TRANSLATIONS: Record<number, { es: string; en: string }> = {
  1: { es: 'Press de Banca', en: 'Bench Press' },
  2: { es: 'Sentadilla', en: 'Squat' },
  3: { es: 'Peso Muerto', en: 'Deadlift' },
  4: { es: 'Press Militar', en: 'Overhead Press' },
  5: { es: 'Elevaciones Laterales', en: 'Lateral Raises' },
  6: { es: 'Curl de Bíceps', en: 'Bicep Curl' },
  7: { es: 'Remo con Barra', en: 'Barbell Row' },
  8: { es: 'Prensa', en: 'Leg Press' },
  9: { es: 'Extensiones de Tríceps', en: 'Tricep Extensions' },
  10: { es: 'Dominadas', en: 'Pull-ups' },
  11: { es: 'Gemelos en Máquina', en: 'Calf Raises' },
  12: { es: 'Press Inclinado con Mancuernas', en: 'Incline Dumbbell Press' },
  13: { es: 'Aperturas en Polea (Cruces)', en: 'Cable Flyes' },
  14: { es: 'Flexiones de Pecho (Push-ups)', en: 'Push-ups' },
  15: { es: 'Martillo', en: 'Hammer Curl' },
  16: { es: 'Jalón al Pecho', en: 'Lat Pulldown' },
  17: { es: 'Remo en Polea Baja (Gironda)', en: 'Seated Cable Row' },
  18: { es: 'Running', en: 'Running' },
  19: { es: 'Peso Muerto Rumano', en: 'Romanian Deadlift' },
  20: { es: 'Extensiones de Cuádriceps', en: 'Leg Extensions' },
  21: { es: 'Curl Femoral Tumbado', en: 'Lying Leg Curl' },
  22: { es: 'Face Pull (Pájaros en Polea)', en: 'Face Pull' },
  23: { es: 'Fondos en Paralelas', en: 'Parallel Bar Dips' },
  24: { es: 'Press Francés', en: 'Skull Crushers' },
  25: { es: 'Plancha Abdominal', en: 'Plank' },
  26: { es: 'Elevación de Piernas', en: 'Leg Raises' },
  30: { es: 'Bici', en: 'Cycling' },
  100: { es: 'Calentamiento', en: 'Warm Up' },
  101: { es: 'Estiramiento', en: 'Stretching' }
}

export function getExerciseDisplayName(
  exercise: { id?: number; exercise_id?: number; name?: string; exercise_name?: string } | string | undefined | null,
  language: Language = 'es'
): string {
  if (!exercise) return ''
  
  if (typeof exercise === 'string') {
    if (language === 'es') return exercise
    return EXERCISE_TRANSLATIONS[exercise]?.en || exercise
  }

  const id = exercise.id !== undefined ? exercise.id : exercise.exercise_id
  const rawName = exercise.name || exercise.exercise_name || ''

  if (language === 'es') {
    return rawName || (id !== undefined && EXERCISE_ID_TRANSLATIONS[id]?.es) || ''
  }

  // Si el idioma es inglés
  if (id !== undefined && EXERCISE_ID_TRANSLATIONS[id]?.en) {
    return EXERCISE_ID_TRANSLATIONS[id].en
  }

  if (rawName && EXERCISE_TRANSLATIONS[rawName]?.en) {
    return EXERCISE_TRANSLATIONS[rawName].en
  }

  return rawName
}
