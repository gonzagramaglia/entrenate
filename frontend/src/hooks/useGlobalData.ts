import { useState, useCallback, useEffect } from 'react'
import { useAuth } from '../contexts/AuthContext'
import { useUserSettings } from '../contexts/UserSettingsContext'
import { useLanguage } from '../contexts/LanguageContext'
import { apiClient } from '../lib/api'
import type { Workout, WorkoutDay } from '../types/workout'
import type { Exercise } from '../types/exercise'
import { MOCK_EXERCISES } from '../lib/mockExercises'

export function useGlobalData() {
  const { isGuest } = useAuth()
  const { initializeAllExercisesAsFavorites } = useUserSettings()
  const { language } = useLanguage()
  
  const [workouts, setWorkouts] = useState<Workout[]>([])
  const [workoutDays, setWorkoutDays] = useState<WorkoutDay[]>([])
  const [exercises, setExercises] = useState<Exercise[]>(MOCK_EXERCISES)
  const [isLoading, setIsLoading] = useState(false)

  const loadData = useCallback(async () => {
    setIsLoading(true)
    
    // Migración de localStorage de entrenar-* a entrenate-* para compatibilidad hacia atrás
    try {
      const keysToMigrate = ['workouts', 'workout-days']
      keysToMigrate.forEach(key => {
        const oldKey = `entrenar-${key}`
        const newKey = `entrenate-${key}`
        const oldData = localStorage.getItem(oldKey)
        
        if (oldData) {
          const currentData = localStorage.getItem(newKey)
          if (!currentData) {
            // No hay datos nuevos, migramos directamente
            localStorage.setItem(newKey, oldData)
            localStorage.removeItem(oldKey)
          } else {
            // Hay datos en ambas claves, intentamos unirlos
            try {
              const oldParsed = JSON.parse(oldData)
              const currentParsed = JSON.parse(currentData)
              
              if (Array.isArray(oldParsed) && Array.isArray(currentParsed)) {
                // Unimos evitando duplicados por ID
                const currentIds = new Set(currentParsed.map((item: any) => item.id))
                const itemsToAdd = oldParsed.filter((item: any) => !currentIds.has(item.id))
                
                if (itemsToAdd.length > 0) {
                  const merged = [...currentParsed, ...itemsToAdd]
                  localStorage.setItem(newKey, JSON.stringify(merged))
                }
                // Si la migración/merge fue exitosa, borramos la clave vieja
                localStorage.removeItem(oldKey)
              }
            } catch (mergeError) {
              console.warn(`Error fusionando datos de ${oldKey}`, mergeError)
              // No borramos la clave vieja si falla el merge
            }
          }
        }
      })
    } catch (migrationError) {
      console.error('Error general en la migración de localStorage:', migrationError)
    }

    try {
      console.log('Cargando datos...')
      if (isGuest) {
        // Datos Mock para Modo Invitado
        let mockExercises: Exercise[] = []
        try {
          const apiExercises = await apiClient.getExercises() as Exercise[]
          if (Array.isArray(apiExercises) && apiExercises.length > 0) {
            mockExercises = apiExercises
          }
        } catch {
          console.warn('Could not fetch exercises for guest, using mock exercises library')
        }

        const exercisesList = (Array.isArray(mockExercises) && mockExercises.length > 0) 
          ? mockExercises 
          : MOCK_EXERCISES
        setExercises(exercisesList)
        
        // Limpiar datos mock antiguos de localStorage si existen
        const MOCK_DAY_IDS = new Set([998, 999, 1000])
        const MOCK_WORKOUT_IDS = new Set([10000, 10001, 10002, 10003, 10004, 10005, 10006, 10007, 10008, 10009, 10010, 10011, 10012, 10013, 10014, 10015, 10016, 10017])
        
        let initialDays: WorkoutDay[] = []
        let initialWorkouts: Workout[] = []

        const savedDays = localStorage.getItem('entrenate-workout-days')
        if (savedDays) {
          try {
            initialDays = JSON.parse(savedDays).filter((d: any) => !MOCK_DAY_IDS.has(d.id))
            localStorage.setItem('entrenate-workout-days', JSON.stringify(initialDays))
          } catch {
            initialDays = []
          }
        }

        const savedWorkouts = localStorage.getItem('entrenate-workouts')
        if (savedWorkouts) {
          try {
            initialWorkouts = JSON.parse(savedWorkouts).filter((w: any) => !MOCK_WORKOUT_IDS.has(w.id))
            localStorage.setItem('entrenate-workouts', JSON.stringify(initialWorkouts))
          } catch {
            initialWorkouts = []
          }
        }

        setWorkoutDays(initialDays)
        setWorkouts(initialWorkouts)
        setIsLoading(false)
        return
      }

      // Cargar workouts, workout days y ejercicios en paralelo
      const [workoutsData, workoutDaysData, exercisesData] = await Promise.all([
        apiClient.getWorkouts(),
        apiClient.getWorkoutDays(),
        apiClient.getExercises()
      ])

      setWorkouts(Array.isArray(workoutsData) ? workoutsData : [])
      setWorkoutDays(Array.isArray(workoutDaysData) ? workoutDaysData : [])
      setExercises(Array.isArray(exercisesData) && exercisesData.length > 0 ? exercisesData : MOCK_EXERCISES)

      // Inicializar todos los ejercicios como favoritos si no hay configuración previa
      // Usar setTimeout para asegurar que las configuraciones se hayan cargado primero
      if (Array.isArray(exercisesData) && exercisesData.length > 0) {
        const exerciseIds = exercisesData.map(ex => ex.id)
        setTimeout(() => {
          initializeAllExercisesAsFavorites(exerciseIds)
        }, 100) // Pequeño delay para que las configuraciones se carguen primero
      }
    } catch (error) {
      console.error('Error cargando datos:', error)

      // Fallback a localStorage si el backend falla
      const savedWorkouts = localStorage.getItem('entrenate-workouts')
      const savedWorkoutDays = localStorage.getItem('entrenate-workout-days')

      if (savedWorkouts) {
        setWorkouts(JSON.parse(savedWorkouts))
      }

      if (savedWorkoutDays) {
        setWorkoutDays(JSON.parse(savedWorkoutDays))
      }

      // Solo usar ejercicios por defecto si no hay ninguno cargado
      setExercises(prev => prev.length > 0 ? prev : MOCK_EXERCISES)
    } finally {
      setIsLoading(false)
    }
  }, [initializeAllExercisesAsFavorites, isGuest, language])

  // Cargar datos desde el backend al montar el componente
  useEffect(() => {
    // Solo cargar datos si no están ya cargados
    if (workouts.length === 0 && workoutDays.length === 0 && exercises.length === 0) {
      loadData()
    }
  }, [loadData, workouts.length, workoutDays.length, exercises.length])

  // Guardar workouts cuando cambien
  useEffect(() => {
    if (workouts.length > 0) {
      localStorage.setItem('entrenate-workouts', JSON.stringify(workouts))
    }
  }, [workouts])

  // Guardar workout days cuando cambien
  useEffect(() => {
    if (workoutDays.length > 0) {
      localStorage.setItem('entrenate-workout-days', JSON.stringify(workoutDays))
    }
  }, [workoutDays])

  // Escuchar eventos de creación de entrenamientos
  useEffect(() => {
    const handleRefresh = () => {
      loadData()
    }
    window.addEventListener('workoutCreated', handleRefresh)
    window.addEventListener('socialFeedRefresh', handleRefresh)
    return () => {
      window.removeEventListener('workoutCreated', handleRefresh)
      window.removeEventListener('socialFeedRefresh', handleRefresh)
    }
  }, [loadData])

  return {
    workouts,
    workoutDays,
    exercises,
    isLoading,
    loadData
  }
}
