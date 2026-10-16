import { render } from '../../test/test-utils'
import { waitFor } from '@testing-library/dom'
import { screen } from '@testing-library/dom'
import { vi, describe, it, expect, beforeEach } from 'vitest'
import WorkoutHistory from './WorkoutHistory'
import { apiClient } from '../../lib/api'

// Mock del API client
vi.mock('../../lib/api', () => ({
  apiClient: {
    getWorkoutDays: vi.fn(),
    getWorkouts: vi.fn(),
    deleteWorkout: vi.fn()
  }
}))

// Mock del contexto de autenticación
vi.mock('../../contexts/AuthContext', () => ({
  useAuth: () => ({
    user: { id: 'test-user-id' },
    isAuthenticated: true,
    isGuest: true
  })
}))

// Mock del contexto de configuración de usuario
vi.mock('../../contexts/UserSettingsContext', () => ({
  useUserSettings: () => ({
    settings: {
      socialEnabled: true
    }
  })
}))

describe('WorkoutHistory', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    vi.mocked(apiClient.getWorkoutDays).mockResolvedValue([])
    vi.mocked(apiClient.getWorkouts).mockResolvedValue([])
  })

  it('renderiza el estado vacío cuando no hay entrenamientos registrados', async () => {
    render(<WorkoutHistory />)

    await waitFor(() => {
      expect(screen.getByText(/aún no hay resultados/i)).toBeInTheDocument()
    })
  })

  it('muestra datos de entrenamientos cuando hay registros', async () => {
    vi.mocked(apiClient.getWorkoutDays).mockResolvedValue([
      {
        id: 1,
        user_id: 'guest',
        date: '2026-04-24',
        name: 'Brazos',
        created_at: '2026-04-24',
        updated_at: '2026-04-24'
      }
    ])
    vi.mocked(apiClient.getWorkouts).mockResolvedValue([
      {
        id: 101,
        user_id: 'guest',
        workout_day_id: 1,
        exercise_id: 5,
        exercise_name: 'Curl de Bíceps',
        reps: 12,
        weight: 15,
        set: 1,
        created_at: '2026-04-24',
        observations: ''
      }
    ])

    render(<WorkoutHistory />)

    await waitFor(() => {
      expect(screen.getByText(/Brazos/i)).toBeInTheDocument()
    })
  })

  it('muestra el calendario de entrenamientos', async () => {
    render(<WorkoutHistory />)

    await waitFor(() => {
      const calendarContainer = document.querySelector('.MuiDateCalendar-root')
      expect(calendarContainer).toBeInTheDocument()
    })
  })
})
