import { createContext, useContext, useState, useEffect, useCallback } from 'react'
import type { ReactNode } from 'react'
import { apiClient } from '../lib/api'
import type { Routine } from '../types/workout'


export interface UserSettings {
  favoriteExercises: number[]
  showOwnWorkoutsInSocial: boolean
  hasConfiguredFavorites: boolean
}

interface CompletedExercises {
  [date: string]: {
    [routineId: number]: {
      [exerciseId: number]: number[] // Array de series completadas
    }
  }
}

interface UserSettingsContextType {
  settings: UserSettings
  setFavoriteExercises: (exercises: number[]) => void
  setHasConfiguredFavorites: (hasConfigured: boolean) => void
  toggleShowOwnWorkoutsInSocial: () => void
  initializeAllExercisesAsFavorites: (exerciseIds: number[]) => void
  onSocialSettingsChange?: () => void
  setOnSocialSettingsChange: (callback: () => void) => void
  // Funciones para ejercicios completados
  completedExercises: CompletedExercises
  toggleExerciseCompleted: (date: string, routineId: number, exerciseId: number, setNumber: number, routine?: Routine) => void
  toggleExerciseAllSets: (date: string, routineId: number, exerciseId: number, totalSets: number, routine?: Routine) => void
  getCompletedExercisesForRoutine: (date: string, routineId: number) => { [exerciseId: number]: number[] }
  getRoutineProgress: (date: string, routineId: number, routine: Routine) => number
  resetCompletedExercisesForDate: (date: string) => void
}

const UserSettingsContext = createContext<UserSettingsContextType | undefined>(undefined)

const defaultSettings: UserSettings = {
  favoriteExercises: [], // Se llenará automáticamente con todos los ejercicios
  showOwnWorkoutsInSocial: true, // Por defecto mostrar ejercicios propios en social
  hasConfiguredFavorites: false // Por defecto no ha configurado favoritos manualmente
}

export function UserSettingsProvider({ children }: { children: ReactNode }) {
  const [settings, setSettings] = useState<UserSettings>(defaultSettings)
  const [onSocialSettingsChange, setOnSocialSettingsChange] = useState<(() => void) | undefined>(undefined)
  const [completedExercises, setCompletedExercises] = useState<CompletedExercises>({})

  // Función para cargar configuraciones desde localStorage
  const loadSettings = useCallback(async () => {
    // Cargar configuraciones solo desde localStorage
    const savedSettings = localStorage.getItem('user-settings')
    if (savedSettings) {
      try {
        const parsedSettings = JSON.parse(savedSettings)
        setSettings({ ...defaultSettings, ...parsedSettings })
      } catch (error) {
        console.error('Error parsing user settings:', error)
        setSettings(defaultSettings)
      }
    } else {
      setSettings(defaultSettings)
    }
  }, [])

  // Cargar configuraciones desde la API al montar
  useEffect(() => {
    loadSettings()
  }, [loadSettings])

  // Guardar configuraciones en localStorage (ejercicios favoritos y configuración)
  useEffect(() => {
    const settingsToSave = {
      favoriteExercises: settings.favoriteExercises,
      hasConfiguredFavorites: settings.hasConfiguredFavorites
    }
    localStorage.setItem('user-settings', JSON.stringify(settingsToSave))
  }, [settings.favoriteExercises, settings.hasConfiguredFavorites])

  const setFavoriteExercises = useCallback(async (exerciseIds: number[]) => {
    setSettings(prev => {
      const newSettings = { 
        ...prev, 
        favoriteExercises: exerciseIds
      }
      return newSettings
    })
    
    // Ya no se hacen llamadas a la API, todo se maneja con localStorage
  }, [])

  const setHasConfiguredFavorites = useCallback(async (hasConfigured: boolean) => {
    console.log('🔍 setHasConfiguredFavorites called with:', hasConfigured)
    setSettings(prev => {
      const newSettings = { 
        ...prev, 
        hasConfiguredFavorites: hasConfigured
      }
      return newSettings
    })
    
    // Ya no se hacen llamadas a la API, todo se maneja con localStorage
  }, [])


  const toggleShowOwnWorkoutsInSocial = useCallback(async () => {
    const newValue = !settings.showOwnWorkoutsInSocial
    setSettings(prev => ({ 
      ...prev, 
      showOwnWorkoutsInSocial: newValue
    }))
    
    try {
      await apiClient.updateUserSettings({ show_own_workouts_in_social: newValue })
      // Ejecutar callback para recargar social si existe
      if (onSocialSettingsChange) {
        onSocialSettingsChange()
      }
    } catch (error) {
      console.error('Error updating show own workouts setting:', error)
    }
  }, [settings.showOwnWorkoutsInSocial, onSocialSettingsChange])



  const initializeAllExercisesAsFavorites = useCallback((exerciseIds: number[]) => {
    // Solo inicializar si no hay ejercicios favoritos configurados Y no ha configurado manualmente
    if (settings.favoriteExercises.length === 0 && !settings.hasConfiguredFavorites && exerciseIds.length > 0) {
      setSettings(prev => ({ 
        ...prev, 
        favoriteExercises: exerciseIds
      }))
    } else {
    }
  }, [settings.favoriteExercises.length, settings.hasConfiguredFavorites])

  // Función para alternar el estado de completado de una serie de un ejercicio
  const toggleExerciseCompleted = useCallback((date: string, routineId: number, exerciseId: number, setNumber: number, routine?: Routine) => {
    setCompletedExercises(prev => {
      const dateObj = { ...(prev[date] || {}) }
      const routineObj = { ...(dateObj[routineId] || {}) }
      const exerciseSets = [...(routineObj[exerciseId] || [])]
      
      let newExerciseSets: number[]
      if (exerciseSets.includes(setNumber)) {
        newExerciseSets = exerciseSets.filter(set => set !== setNumber)
      } else {
        newExerciseSets = [...exerciseSets, setNumber].sort((a, b) => a - b)
      }
      
      const newRoutineObj = {
        ...routineObj,
        [exerciseId]: newExerciseSets
      }
      const newDateObj = {
        ...dateObj,
        [routineId]: newRoutineObj
      }
      const newState = {
        ...prev,
        [date]: newDateObj
      }
      
      localStorage.setItem('completed-exercises', JSON.stringify(newState))
      
      if (routine && routine.exercises) {
        let completedSets = 0
        let totalSets = 0
        
        routine.exercises.forEach((exercise: any) => {
          const exId = exercise.exercise_id || exercise.id
          const completedSetsForExercise = newRoutineObj[exId]?.length || 0
          const targetSets = exercise.sets || 1
          
          completedSets += Math.min(completedSetsForExercise, targetSets)
          totalSets += targetSets
        })
        
        const progress = totalSets > 0 ? Math.round((completedSets / totalSets) * 100) : 0
        
        if (progress === 100) {
          const confettiEvent = new CustomEvent('routineCompletedManually', { 
            detail: { routineId, routine, progress } 
          })
          window.dispatchEvent(confettiEvent)
        }
      }
      
      return newState
    })
  }, [])

  // Función para marcar/desmarcar todas las series de un ejercicio
  const toggleExerciseAllSets = useCallback((date: string, routineId: number, exerciseId: number, totalSets: number, routine?: Routine) => {
    setCompletedExercises(prev => {
      const dateObj = { ...(prev[date] || {}) }
      const routineObj = { ...(dateObj[routineId] || {}) }
      const currentSets = routineObj[exerciseId] || []
      
      const isAlreadyCompleted = currentSets.length >= totalSets
      const newExerciseSets = isAlreadyCompleted ? [] : Array.from({ length: totalSets }, (_, i) => i + 1)
      
      const newRoutineObj = {
        ...routineObj,
        [exerciseId]: newExerciseSets
      }
      const newDateObj = {
        ...dateObj,
        [routineId]: newRoutineObj
      }
      const newState = {
        ...prev,
        [date]: newDateObj
      }
      
      localStorage.setItem('completed-exercises', JSON.stringify(newState))
      
      if (routine && routine.exercises) {
        let completedSets = 0
        let totalSetsCount = 0
        
        routine.exercises.forEach((exercise: any) => {
          const exId = exercise.exercise_id || exercise.id
          const completedSetsForExercise = newRoutineObj[exId]?.length || 0
          const targetSets = exercise.sets || 1
          
          completedSets += Math.min(completedSetsForExercise, targetSets)
          totalSetsCount += targetSets
        })
        
        const progress = totalSetsCount > 0 ? Math.round((completedSets / totalSetsCount) * 100) : 0
        
        if (progress === 100) {
          const confettiEvent = new CustomEvent('routineCompletedManually', { 
            detail: { routineId, routine, progress } 
          })
          window.dispatchEvent(confettiEvent)
        }
      }
      
      return newState
    })
  }, [])

  // Función para obtener ejercicios completados de una rutina en una fecha
  const getCompletedExercisesForRoutine = useCallback((date: string, routineId: number) => {
    return completedExercises[date]?.[routineId] || {}
  }, [completedExercises])

  // Función para calcular el progreso de una rutina
  const getRoutineProgress = useCallback((date: string, routineId: number, routine: Routine) => {
    if (!routine || !routine.exercises) return 0
    
    const completedForRoutine = getCompletedExercisesForRoutine(date, routineId)
    let completedSets = 0
    let totalSets = 0
    
    routine.exercises.forEach((exercise: any) => {
      const exId = exercise.exercise_id || exercise.id
      const completedSetsForExercise = completedForRoutine[exId]?.length || 0
      const targetSets = exercise.sets || 1
      
      completedSets += Math.min(completedSetsForExercise, targetSets)
      totalSets += targetSets
    })
    
    return totalSets > 0 ? Math.round((completedSets / totalSets) * 100) : 0
  }, [getCompletedExercisesForRoutine])

  // Función para resetear ejercicios completados de una fecha
  const resetCompletedExercisesForDate = useCallback((date: string) => {
    setCompletedExercises(prev => {
      const newState = { ...prev }
      delete newState[date]
      localStorage.setItem('completed-exercises', JSON.stringify(newState))
      return newState
    })
  }, [])

  // Cargar ejercicios completados desde localStorage al montar
  useEffect(() => {
    const savedCompletedExercises = localStorage.getItem('completed-exercises')
    if (savedCompletedExercises) {
      try {
        const parsed = JSON.parse(savedCompletedExercises)
        setCompletedExercises(parsed)
      } catch (error) {
        console.error('Error parsing completed exercises:', error)
      }
    }
  }, [])

  const value: UserSettingsContextType = {
    settings, 
    setFavoriteExercises,
    setHasConfiguredFavorites,
    toggleShowOwnWorkoutsInSocial,
    initializeAllExercisesAsFavorites,
    onSocialSettingsChange,
    setOnSocialSettingsChange,
    completedExercises,
    toggleExerciseCompleted,
    toggleExerciseAllSets,
    getCompletedExercisesForRoutine,
    getRoutineProgress,
    resetCompletedExercisesForDate
  }

  return (
    <UserSettingsContext.Provider value={value}>
      {children}
    </UserSettingsContext.Provider>
  )
}

export function useUserSettings() {
  const context = useContext(UserSettingsContext)
  if (context === undefined) {
    throw new Error('useUserSettings must be used within a UserSettingsProvider')
  }
  return context
}
