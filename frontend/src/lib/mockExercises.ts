import type { Exercise } from '../types/exercise'

export type MockExercise = Exercise

export const MOCK_EXERCISES: Exercise[] = [
  // Pecho
  {
    id: 1,
    name: 'Press de Banca',
    muscle_group: 'Pecho',
    primary_muscles: ['Pectoral Mayor', 'Tríceps'],
    secondary_muscles: ['Deltoides Anterior', 'Serrato Anterior'],
    video_url: 'https://www.youtube.com/watch?v=rT7DgCr-3pg',
    bodyweight: false,
    is_sport: false,
    created_at: '2026-01-01'
  },
  {
    id: 12,
    name: 'Press Inclinado con Mancuernas',
    muscle_group: 'Pecho',
    primary_muscles: ['Pectoral Superior', 'Tríceps'],
    secondary_muscles: ['Deltoides Anterior'],
    video_url: 'https://www.youtube.com/watch?v=8iPEnn-ltC8',
    bodyweight: false,
    is_sport: false,
    created_at: '2026-01-01'
  },
  {
    id: 13,
    name: 'Aperturas en Polea (Cruces)',
    muscle_group: 'Pecho',
    primary_muscles: ['Pectoral Mayor'],
    secondary_muscles: ['Deltoides Anterior'],
    video_url: 'https://www.youtube.com/watch?v=taI4XduLpTk',
    bodyweight: false,
    is_sport: false,
    created_at: '2026-01-01'
  },
  {
    id: 14,
    name: 'Flexiones de Pecho (Push-ups)',
    muscle_group: 'Pecho',
    primary_muscles: ['Pectoral Mayor', 'Tríceps'],
    secondary_muscles: ['Core', 'Deltoides Anterior'],
    video_url: 'https://www.youtube.com/watch?v=IODxDxX7oi4',
    bodyweight: true,
    is_sport: false,
    created_at: '2026-01-01'
  },

  // Espalda
  {
    id: 3,
    name: 'Peso Muerto',
    muscle_group: 'Espalda',
    primary_muscles: ['Erector Espinal', 'Glúteos', 'Isquiotibiales'],
    secondary_muscles: ['Trapecio', 'Romboides', 'Core', 'Antebrazos'],
    video_url: 'https://www.youtube.com/watch?v=op9kVnSso6Q',
    bodyweight: false,
    is_sport: false,
    created_at: '2026-01-01'
  },
  {
    id: 7,
    name: 'Remo con Barra',
    muscle_group: 'Espalda',
    primary_muscles: ['Dorsal Ancho', 'Romboides', 'Trapecio Medio'],
    secondary_muscles: ['Bíceps', 'Deltoides Posterior'],
    video_url: 'https://www.youtube.com/watch?v=FWJR5Ve8gkQ',
    bodyweight: false,
    is_sport: false,
    created_at: '2026-01-01'
  },
  {
    id: 10,
    name: 'Dominadas',
    muscle_group: 'Espalda',
    primary_muscles: ['Dorsal Ancho', 'Redondo Mayor'],
    secondary_muscles: ['Bíceps', 'Romboides'],
    video_url: 'https://www.youtube.com/watch?v=eGo4IYlbE5g',
    bodyweight: true,
    is_sport: false,
    created_at: '2026-01-01'
  },
  {
    id: 16,
    name: 'Jalón al Pecho',
    muscle_group: 'Espalda',
    primary_muscles: ['Dorsal Ancho'],
    secondary_muscles: ['Bíceps', 'Braquial'],
    video_url: 'https://www.youtube.com/watch?v=CAwf7n6Luuc',
    bodyweight: false,
    is_sport: false,
    created_at: '2026-01-01'
  },
  {
    id: 17,
    name: 'Remo en Polea Baja (Gironda)',
    muscle_group: 'Espalda',
    primary_muscles: ['Dorsal Ancho', 'Romboides'],
    secondary_muscles: ['Bíceps', 'Deltoides Posterior'],
    video_url: 'https://www.youtube.com/watch?v=GZbfZ033f74',
    bodyweight: false,
    is_sport: false,
    created_at: '2026-01-01'
  },

  // Piernas
  {
    id: 2,
    name: 'Sentadilla',
    muscle_group: 'Piernas',
    primary_muscles: ['Cuádriceps', 'Glúteos'],
    secondary_muscles: ['Isquiotibiales', 'Gastrocnemio', 'Core'],
    video_url: 'https://www.youtube.com/watch?v=aclHkVaku9U',
    bodyweight: false,
    is_sport: false,
    created_at: '2026-01-01'
  },
  {
    id: 8,
    name: 'Prensa',
    muscle_group: 'Piernas',
    primary_muscles: ['Cuádriceps', 'Glúteos'],
    secondary_muscles: ['Isquiotibiales'],
    video_url: 'https://www.youtube.com/watch?v=IZxyjW7MPJQ',
    bodyweight: false,
    is_sport: false,
    created_at: '2026-01-01'
  },
  {
    id: 11,
    name: 'Gemelos en Máquina',
    muscle_group: 'Piernas',
    primary_muscles: ['Gastrocnemio', 'Sóleo'],
    secondary_muscles: ['Tibial Posterior'],
    video_url: 'https://www.youtube.com/watch?v=N3AwviqBfOQ',
    bodyweight: false,
    is_sport: false,
    created_at: '2026-01-01'
  },
  {
    id: 19,
    name: 'Peso Muerto Rumano',
    muscle_group: 'Piernas',
    primary_muscles: ['Isquiotibiales', 'Glúteo Mayor'],
    secondary_muscles: ['Erector Espinal', 'Core'],
    video_url: 'https://www.youtube.com/watch?v=jEy_czb3RKA',
    bodyweight: false,
    is_sport: false,
    created_at: '2026-01-01'
  },
  {
    id: 20,
    name: 'Extensiones de Cuádriceps',
    muscle_group: 'Piernas',
    primary_muscles: ['Cuádriceps'],
    secondary_muscles: [],
    video_url: 'https://www.youtube.com/watch?v=YyvSfVjQeL0',
    bodyweight: false,
    is_sport: false,
    created_at: '2026-01-01'
  },
  {
    id: 21,
    name: 'Curl Femoral Tumbado',
    muscle_group: 'Piernas',
    primary_muscles: ['Isquiotibiales'],
    secondary_muscles: ['Gastrocnemio'],
    video_url: 'https://www.youtube.com/watch?v=1Tq3QdYUuHs',
    bodyweight: false,
    is_sport: false,
    created_at: '2026-01-01'
  },

  // Hombros
  {
    id: 4,
    name: 'Press Militar',
    muscle_group: 'Hombros',
    primary_muscles: ['Deltoides Anterior', 'Deltoides Medio'],
    secondary_muscles: ['Tríceps', 'Trapecio Superior'],
    video_url: 'https://www.youtube.com/watch?v=2yjwXTZQDDI',
    bodyweight: false,
    is_sport: false,
    created_at: '2026-01-01'
  },
  {
    id: 23,
    name: 'Elevaciones Laterales',
    muscle_group: 'Hombros',
    primary_muscles: ['Deltoides Medio'],
    secondary_muscles: ['Trapecio', 'Deltoides Anterior'],
    video_url: 'https://www.youtube.com/watch?v=3VcKaXpzqRo',
    bodyweight: false,
    is_sport: false,
    created_at: '2026-01-01'
  },
  {
    id: 24,
    name: 'Face Pull (Pájaros en Polea)',
    muscle_group: 'Hombros',
    primary_muscles: ['Deltoides Posterior', 'Manguito Rotador'],
    secondary_muscles: ['Trapecio Medio', 'Romboides'],
    video_url: 'https://www.youtube.com/watch?v=rep-qVOkqgk',
    bodyweight: false,
    is_sport: false,
    created_at: '2026-01-01'
  },

  // Brazos
  {
    id: 5,
    name: 'Curl de Bíceps',
    muscle_group: 'Brazos',
    primary_muscles: ['Bíceps Braquial'],
    secondary_muscles: ['Braquiorradial', 'Braquial'],
    video_url: 'https://www.youtube.com/watch?v=ykJmrZ5v0Oa',
    bodyweight: false,
    is_sport: false,
    created_at: '2026-01-01'
  },
  {
    id: 6,
    name: 'Extensiones de Tríceps',
    muscle_group: 'Brazos',
    primary_muscles: ['Tríceps Braquial'],
    secondary_muscles: ['Ancóneo'],
    video_url: 'https://www.youtube.com/watch?v=2-LAMcpzODU',
    bodyweight: false,
    is_sport: false,
    created_at: '2026-01-01'
  },
  {
    id: 9,
    name: 'Martillo',
    muscle_group: 'Brazos',
    primary_muscles: ['Braquiorradial', 'Bíceps'],
    secondary_muscles: ['Braquial Anterior'],
    video_url: 'https://www.youtube.com/watch?v=zC3nLlEvin4',
    bodyweight: false,
    is_sport: false,
    created_at: '2026-01-01'
  },
  {
    id: 15,
    name: 'Fondos en Paralelas',
    muscle_group: 'Brazos',
    primary_muscles: ['Tríceps', 'Pectoral Inferior'],
    secondary_muscles: ['Deltoides Anterior'],
    video_url: 'https://www.youtube.com/watch?v=2z8JmcrW-As',
    bodyweight: true,
    is_sport: false,
    created_at: '2026-01-01'
  },
  {
    id: 26,
    name: 'Press Francés',
    muscle_group: 'Brazos',
    primary_muscles: ['Tríceps (Cabeza Larga)'],
    secondary_muscles: ['Antebrazos'],
    video_url: 'https://www.youtube.com/watch?v=d_KZxkY_0cM',
    bodyweight: false,
    is_sport: false,
    created_at: '2026-01-01'
  },

  // Core
  {
    id: 28,
    name: 'Plancha Abdominal',
    muscle_group: 'Core',
    primary_muscles: ['Recto Abdominal', 'Transverso Abdominal'],
    secondary_muscles: ['Glúteos', 'Hombros'],
    video_url: 'https://www.youtube.com/watch?v=ASdvN_XEl_c',
    bodyweight: true,
    is_sport: false,
    created_at: '2026-01-01'
  },
  {
    id: 31,
    name: 'Elevación de Piernas',
    muscle_group: 'Core',
    primary_muscles: ['Abdominales Inferiores', 'Flexores de Cadera'],
    secondary_muscles: ['Oblicuos'],
    video_url: 'https://www.youtube.com/watch?v=JB2oyawG9KI',
    bodyweight: true,
    is_sport: false,
    created_at: '2026-01-01'
  },

  // Cardio y Deportes
  {
    id: 18,
    name: 'Running',
    muscle_group: 'Cardio',
    primary_muscles: ['Sistema Cardiovascular', 'Piernas'],
    secondary_muscles: ['Glúteos', 'Core'],
    video_url: 'https://www.youtube.com/watch?v=brFHyOTtYMo',
    bodyweight: true,
    is_sport: true,
    created_at: '2026-01-01'
  },
  {
    id: 30,
    name: 'Bici',
    muscle_group: 'Cardio',
    primary_muscles: ['Cuádriceps', 'Sistema Cardiovascular'],
    secondary_muscles: ['Isquiotibiales', 'Gemelos'],
    video_url: 'https://www.youtube.com/watch?v=4mX_o3E4Cis',
    bodyweight: false,
    is_sport: true,
    created_at: '2026-01-01'
  },
  {
    id: 100,
    name: 'Calentamiento',
    muscle_group: 'Movilidad',
    primary_muscles: ['Cuerpo Completo'],
    secondary_muscles: [],
    video_url: 'https://www.youtube.com/watch?v=uTViT0WkF8g',
    bodyweight: true,
    is_sport: false,
    created_at: '2026-01-01'
  },
  {
    id: 101,
    name: 'Estiramiento',
    muscle_group: 'Movilidad',
    primary_muscles: ['Cuerpo Completo'],
    secondary_muscles: [],
    video_url: 'https://www.youtube.com/watch?v=g_tea8ZNk5A',
    bodyweight: true,
    is_sport: false,
    created_at: '2026-01-01'
  }
]
