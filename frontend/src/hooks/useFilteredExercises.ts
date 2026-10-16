import { useState, useEffect, useMemo } from 'react'
import type { Exercise } from '../types/workout'
import type { UserSettings } from '../contexts/UserSettingsContext'
import { MOCK_EXERCISES } from '../lib/mockExercises'

export function useFilteredExercises(
  exercises: Exercise[],
  settings: UserSettings,
  userRole?: string,
  isAdmin?: boolean
) {
  const [isLoadingExercises, setIsLoadingExercises] = useState(false)
  const [refreshTrigger, setRefreshTrigger] = useState(0)

  useEffect(() => {
    setIsLoadingExercises(false)
  }, [exercises, settings])

  // Escuchar cambios en localStorage para actualizar ejercicios instantáneamente
  useEffect(() => {
    const handleStorageChange = () => {
      setRefreshTrigger(prev => prev + 1)
    }

    window.addEventListener('storage', handleStorageChange)
    window.addEventListener('admin-exercise-settings-updated', handleStorageChange)

    return () => {
      window.removeEventListener('storage', handleStorageChange)
      window.removeEventListener('admin-exercise-settings-updated', handleStorageChange)
    }
  }, [])

  // Filtrar ejercicios favoritos según configuraciones
  const filteredExercises = useMemo(() => {
    const baseExercises: Exercise[] = (exercises && exercises.length > 0) ? exercises : MOCK_EXERCISES
    let filtered = baseExercises

    try {
      const adminSettings = localStorage.getItem('admin-exercise-settings')
      if (adminSettings) {
        const parsed = JSON.parse(adminSettings)
        if (parsed.hasConfigured && Array.isArray(parsed.favoriteExercises) && parsed.favoriteExercises.length > 0) {
          const matched = baseExercises.filter(exercise => parsed.favoriteExercises.includes(exercise.id))
          filtered = matched.length > 0 ? matched : baseExercises.filter(exercise => !exercise.is_sport)
        } else if (Array.isArray(parsed.favoriteExercises) && parsed.favoriteExercises.length > 0) {
          const matched = baseExercises.filter(exercise => parsed.favoriteExercises.includes(exercise.id))
          filtered = matched.length > 0 ? matched : baseExercises.filter(exercise => !exercise.is_sport)
        } else {
          filtered = baseExercises.filter(exercise => !exercise.is_sport)
        }
      } else {
        if (settings.hasConfiguredFavorites && settings.favoriteExercises.length > 0) {
          const matched = baseExercises.filter(exercise => settings.favoriteExercises.includes(exercise.id))
          filtered = matched.length > 0 ? matched : baseExercises.filter(exercise => !exercise.is_sport)
        } else {
          filtered = baseExercises.filter(exercise => !exercise.is_sport)
        }
      }
    } catch (error) {
      console.error('Error loading exercise settings:', error)
      filtered = baseExercises.filter(exercise => !exercise.is_sport)
    }

    // Asegurar que nunca retorne un array vacío
    if (!filtered || filtered.length === 0) {
      const nonSports = baseExercises.filter(exercise => !exercise.is_sport)
      return nonSports.length > 0 ? nonSports : baseExercises
    }

    return filtered
  }, [exercises, settings.hasConfiguredFavorites, settings.favoriteExercises, userRole, isAdmin, refreshTrigger])

  return { filteredExercises, isLoadingExercises }
}
