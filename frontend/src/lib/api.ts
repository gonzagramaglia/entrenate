import { supabase } from './supabase'
import { MOCK_EXERCISES } from './mockExercises'

function isGuestMode(): boolean {
  return typeof window !== 'undefined' && localStorage.getItem('isGuest') === 'true'
}

const MOCK_DAY_IDS = new Set([998, 999, 1000])
const MOCK_WORKOUT_IDS = new Set([10000, 10001, 10002, 10003, 10004, 10005, 10006, 10007, 10008, 10009, 10010, 10011, 10012, 10013, 10014, 10015])

const getApiBaseUrl = () => {
  // Temporal: hardcode para Railway deployment
  const baseUrl = import.meta.env.VITE_API_BASE_URL || 'https://entrenate-backend.up.railway.app'
  // Asegurar que siempre termine con /api
  return baseUrl.endsWith('/api') ? baseUrl : `${baseUrl}/api`
}

const API_BASE_URL = getApiBaseUrl()

interface ApiRequestConfig {
  method?: 'GET' | 'POST' | 'PUT' | 'DELETE'
  headers?: Record<string, string>
  body?: any
  requireAuth?: boolean
}

class ApiClient {
  private baseUrl: string

  constructor(baseUrl: string) {
    this.baseUrl = baseUrl
  }

  private async getAuthHeaders(): Promise<Record<string, string>> {
    const { data: { session } } = await supabase.auth.getSession()

    if (!session?.access_token) {
      throw new Error('No auth session found')
    }

    return {
      'Authorization': `Bearer ${session.access_token}`,
      'Content-Type': 'application/json'
    }
  }

  private async request<T>(endpoint: string, config: ApiRequestConfig = {}): Promise<T> {
    const {
      method = 'GET',
      headers = {},
      body,
      requireAuth = true
    } = config

    // Construir la URL correctamente para el proxy
    let url: string
    if (this.baseUrl === '/api/proxy') {
      // Para el proxy, necesitamos pasar el endpoint como query parameter
      const path = endpoint.startsWith('/') ? endpoint.slice(1) : endpoint
      url = `${this.baseUrl}?path=${encodeURIComponent(path)}`
    } else {
      // Para desarrollo local, usar la URL completa
      url = `${this.baseUrl}${endpoint}`
    }

    let requestHeaders: Record<string, string> = {
      'Content-Type': 'application/json',
      ...headers
    }

    // Add auth headers if required
    if (requireAuth) {
      try {
        const authHeaders = await this.getAuthHeaders()
        requestHeaders = { ...requestHeaders, ...authHeaders }
      } catch (error) {
        throw new Error('Authentication required')
      }
    }

    const requestConfig: RequestInit = {
      method,
      headers: requestHeaders,
    }

    if (body && method !== 'GET') {
      const bodyString = JSON.stringify(body)
      requestConfig.body = bodyString
    }

    try {
      const response = await fetch(url, requestConfig)

      if (!response.ok) {
        const errorText = await response.text()

        // Si es un error 401, limpiar la sesión automáticamente
        if (response.status === 401) {
          console.log('🔒 401 Unauthorized - Limpiando sesión automáticamente')
          try {
            await supabase.auth.signOut()
            // Recargar la página para ir al login
            window.location.reload()
          } catch (signOutError) {
            console.error('Error during automatic signout:', signOutError)
          }
        }

        throw new Error(`API Error: ${response.status} - ${errorText}`)
      }

      // Handle empty responses
      const contentType = response.headers.get('content-type')
      if (contentType && contentType.includes('application/json')) {
        return await response.json()
      } else {
        return {} as T
      }
    } catch (error) {
      console.error(`API request failed: ${method} ${url}`, error)
      throw error
    }
  }

  // Health check (no auth required)
  async health() {
    return this.request('/health', { requireAuth: false })
  }

  // Update last sign in
  async updateLastSignIn() {
    return this.request('/me/last-signin', { method: 'POST' })
  }

  // Setup user after registration
  async setupUser(userId: string, email: string, name?: string, language?: string) {
    return this.request('/me/setup', {
      method: 'POST',
      body: { user_id: userId, email, name, language }
    })
  }

  private getLocalWorkoutDays(): any[] {
    if (typeof window === 'undefined') return []
    const raw = localStorage.getItem('entrenate-workout-days')
    if (!raw) return []
    try {
      const parsed = JSON.parse(raw)
      return Array.isArray(parsed) ? parsed.filter(d => !MOCK_DAY_IDS.has(d.id)) : []
    } catch {
      return []
    }
  }

  private setLocalWorkoutDays(days: any[]) {
    if (typeof window !== 'undefined') {
      localStorage.setItem('entrenate-workout-days', JSON.stringify(days))
    }
  }

  private getLocalWorkouts(): any[] {
    if (typeof window === 'undefined') return []
    const raw = localStorage.getItem('entrenate-workouts')
    if (!raw) return []
    try {
      const parsed = JSON.parse(raw)
      return Array.isArray(parsed) ? parsed.filter(w => !MOCK_WORKOUT_IDS.has(w.id)) : []
    } catch {
      return []
    }
  }

  private setLocalWorkouts(workouts: any[]) {
    if (typeof window !== 'undefined') {
      localStorage.setItem('entrenate-workouts', JSON.stringify(workouts))
    }
  }

  // Workouts API
  async getWorkouts(date?: string, workoutDayId?: string) {
    if (isGuestMode()) {
      let workouts = this.getLocalWorkouts()
      if (date) {
        workouts = workouts.filter((w: any) => w.created_at?.startsWith(date) || w.date === date)
      }
      if (workoutDayId) {
        workouts = workouts.filter((w: any) => String(w.workout_day_id) === String(workoutDayId))
      }
      return workouts
    }

    const params = new URLSearchParams()
    if (date) params.append('date', date)
    if (workoutDayId) params.append('workout_day_id', workoutDayId)

    const query = params.toString()
    const endpoint = query ? `/workouts?${query}` : '/workouts'
    try {
      return await this.request(endpoint)
    } catch {
      let workouts = this.getLocalWorkouts()
      if (date) {
        workouts = workouts.filter((w: any) => w.created_at?.startsWith(date) || w.date === date)
      }
      if (workoutDayId) {
        workouts = workouts.filter((w: any) => String(w.workout_day_id) === String(workoutDayId))
      }
      return workouts
    }
  }

  async createWorkout(workout: any) {
    if (isGuestMode()) {
      return this.saveLocalWorkout(workout)
    }
    try {
      return await this.request('/workouts', {
        method: 'POST',
        body: workout
      })
    } catch {
      return this.saveLocalWorkout(workout)
    }
  }

  private saveLocalWorkout(workout: any) {
    const selectedDate = workout.date || new Date().toISOString().split('T')[0]
    const days = this.getLocalWorkoutDays()
    const workouts = this.getLocalWorkouts()

    let exerciseName = workout.exercise_name
    if (!exerciseName) {
      const ex = MOCK_EXERCISES.find(e => e.id === Number(workout.exercise_id))
      exerciseName = ex ? ex.name : `Ejercicio #${workout.exercise_id}`
    }

    let day = days.find((d: any) => d.date === selectedDate)
    if (!day) {
      day = {
        id: Date.now(),
        user_id: 'guest',
        date: selectedDate,
        name: exerciseName,
        created_at: selectedDate,
        updated_at: selectedDate,
        effort: 5,
        mood: 5
      }
      days.push(day)
      this.setLocalWorkoutDays(days)
    }

    const newWorkout = {
      id: Date.now() + Math.floor(Math.random() * 1000),
      user_id: 'guest',
      workout_day_id: day.id,
      exercise_id: Number(workout.exercise_id),
      exercise_name: exerciseName,
      reps: workout.reps !== undefined ? Number(workout.reps) : 0,
      weight: workout.weight !== undefined ? Number(workout.weight) : 0,
      seconds: workout.seconds !== undefined ? Number(workout.seconds) : undefined,
      set: workout.set !== undefined ? Number(workout.set) : 1,
      created_at: selectedDate,
      observations: workout.observations || ''
    }

    workouts.push(newWorkout)
    this.setLocalWorkouts(workouts)

    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('workoutCreated', { detail: newWorkout }))
    }

    return newWorkout
  }

  async updateWorkout(id: number, workout: any) {
    if (isGuestMode()) {
      return this.updateLocalWorkout(id, workout)
    }
    try {
      return await this.request(`/workouts/${id}`, {
        method: 'PUT',
        body: workout
      })
    } catch {
      return this.updateLocalWorkout(id, workout)
    }
  }

  private updateLocalWorkout(id: number, workout: any) {
    const workouts = this.getLocalWorkouts()
    const index = workouts.findIndex((w: any) => w.id === id)
    if (index !== -1) {
      workouts[index] = { ...workouts[index], ...workout }
      this.setLocalWorkouts(workouts)
      return workouts[index]
    }
    return workout
  }

  async updateWorkoutDayName(id: number, name: string) {
    if (isGuestMode()) {
      const days = this.getLocalWorkoutDays()
      const index = days.findIndex((d: any) => d.id === id)
      if (index !== -1) {
        days[index].name = name
        this.setLocalWorkoutDays(days)
      }
      return { success: true }
    }
    try {
      return await this.request(`/workout-days/${id}/name`, {
        method: 'PUT',
        body: { name }
      })
    } catch {
      const days = this.getLocalWorkoutDays()
      const index = days.findIndex((d: any) => d.id === id)
      if (index !== -1) {
        days[index].name = name
        this.setLocalWorkoutDays(days)
      }
      return { success: true }
    }
  }

  async deleteWorkout(id: number) {
    if (isGuestMode()) {
      return this.deleteLocalWorkout(id)
    }
    try {
      return await this.request(`/workouts/${id}`, {
        method: 'DELETE'
      })
    } catch {
      return this.deleteLocalWorkout(id)
    }
  }

  private deleteLocalWorkout(id: number) {
    let workouts = this.getLocalWorkouts()
    const toDelete = workouts.find((w: any) => w.id === id)
    workouts = workouts.filter((w: any) => w.id !== id)
    this.setLocalWorkouts(workouts)

    if (toDelete?.workout_day_id) {
      const remainingInDay = workouts.filter((w: any) => w.workout_day_id === toDelete.workout_day_id)
      if (remainingInDay.length === 0) {
        let days = this.getLocalWorkoutDays()
        days = days.filter((d: any) => d.id !== toDelete.workout_day_id)
        this.setLocalWorkoutDays(days)
      }
    }
    return { success: true }
  }

  async deleteDayWorkouts(workoutDayId: number, workoutIds: number[]) {
    if (isGuestMode()) {
      let workouts = this.getLocalWorkouts()
      workouts = workouts.filter((w: any) => w.workout_day_id !== workoutDayId && !workoutIds.includes(w.id))
      this.setLocalWorkouts(workouts)

      let days = this.getLocalWorkoutDays()
      days = days.filter((d: any) => d.id !== workoutDayId)
      this.setLocalWorkoutDays(days)
      return { success: true }
    }
    try {
      await Promise.all(workoutIds.map(id => this.request(`/workouts/${id}`, { method: 'DELETE' })))
      return { success: true }
    } catch {
      let workouts = this.getLocalWorkouts()
      workouts = workouts.filter((w: any) => w.workout_day_id !== workoutDayId && !workoutIds.includes(w.id))
      this.setLocalWorkouts(workouts)

      let days = this.getLocalWorkoutDays()
      days = days.filter((d: any) => d.id !== workoutDayId)
      this.setLocalWorkoutDays(days)
      return { success: true }
    }
  }

  // Workout Days API
  async getWorkoutDays() {
    if (isGuestMode()) {
      return this.getLocalWorkoutDays()
    }
    try {
      return await this.request('/workout-days')
    } catch {
      const local = this.getLocalWorkoutDays()
      if (local.length > 0) return local
      return []
    }
  }

  // Exercises API
  async getExercises() {
    if (isGuestMode()) {
      return MOCK_EXERCISES
    }
    try {
      const res = await this.request('/exercises', { requireAuth: false })
      if (Array.isArray(res) && res.length > 0) {
        return res
      }
      return MOCK_EXERCISES
    } catch {
      return MOCK_EXERCISES
    }
  }

  async getExercise(id: number) {
    if (isGuestMode()) {
      const found = MOCK_EXERCISES.find(ex => ex.id === id)
      if (found) return found
    }
    try {
      return await this.request(`/exercises/${id}`, { requireAuth: false })
    } catch {
      const found = MOCK_EXERCISES.find(ex => ex.id === id)
      if (found) return found
      throw new Error(`Exercise ${id} not found`)
    }
  }



  // User API
  async getCurrentUser() {
    return this.request('/me')
  }

  async getUserStats() {
    return this.request('/me/stats')
  }

  // Social API
  async getSocialWorkouts(limit: number = 10, offset: number = 0): Promise<any[]> {
    const params = new URLSearchParams({
      limit: limit.toString(),
      offset: offset.toString()
    })
    return this.request(`/social/workouts?${params}`)
  }


  // Notifications API
  async getNotifications(limit: number = 20, offset: number = 0) {
    const params = new URLSearchParams({
      limit: limit.toString(),
      offset: offset.toString()
    })
    return this.request(`/notifications?${params}`)
  }

  async getSystemNotifications() {
    return this.request('/notifications/system')
  }

  async getUnreadNotificationsCount() {
    return this.request('/notifications/count')
  }

  async markNotificationAsRead(id: number) {
    return this.request(`/notifications/${id}/read`, {
      method: 'PUT'
    })
  }

  async markAllNotificationsAsRead() {
    return this.request('/notifications/read-all', {
      method: 'PUT'
    })
  }

  async deleteNotification(id: number) {
    return this.request(`/notifications/${id}`, {
      method: 'DELETE'
    })
  }

  // Welcome notification API
  async createWelcomeNotification() {
    return this.request('/welcome-notification', {
      method: 'POST'
    })
  }

  async getWelcomeNotification() {
    return this.request('/welcome-notification')
  }

  // User Settings API
  async getUserSettings() {
    return this.request('/user-settings')
  }

  async updateUserSettings(settings: { show_own_workouts_in_social?: boolean; has_configured_favorites?: boolean; favorite_exercises?: number[] }) {
    return this.request('/user-settings', {
      method: 'PUT',
      body: settings
    })
  }

  // Admin API
  async getAdminNotifications() {
    return this.request('/admin/notifications')
  }

  async createAdminNotification(notification: {
    title: string
    message: string
    type: 'info' | 'warning' | 'success' | 'error'
  }) {
    return this.request('/admin/notifications', {
      method: 'POST',
      body: notification
    })
  }

  async deleteAdminNotification(id: number) {
    return this.request(`/admin/notifications/${id}`, {
      method: 'DELETE'
    })
  }

  async updateAdminNotification(id: number, notification: {
    title: string
    message: string
    type: 'info' | 'warning' | 'success' | 'error'
  }) {
    return this.request(`/admin/notifications/${id}`, {
      method: 'PUT',
      body: notification
    })
  }

  async getNotificationHistory(id: number) {
    return this.request(`/admin/notifications/${id}/history`)
  }

  async getAdminExercises() {
    return this.request('/admin/exercises')
  }

  async createAdminExercise(exercise: {
    name: string
    muscle_group: string
    primary_muscles: string[]
    secondary_muscles: string[]

    video_url?: string
    bodyweight?: boolean
    is_sport?: boolean
  }) {
    return this.request('/admin/exercises', {
      method: 'POST',
      body: exercise
    })
  }

  async getAdminUsers() {
    return this.request('/admin/users')
  }

  async deleteAdminUser(id: string) {
    return this.request(`/admin/users/${id}`, {
      method: 'DELETE'
    })
  }

  async updateAdminUserRole(id: string, role: string) {
    return this.request(`/admin/users/${id}/role`, {
      method: 'PUT',
      body: { role }
    })
  }

  async updateAdminUserName(id: string, name: string) {
    return this.request(`/admin/users/${id}/name`, {
      method: 'PUT',
      body: { name }
    })
  }

  private getLocalRoutines(): any[] {
    if (typeof window === 'undefined') return []
    const raw = localStorage.getItem('entrenate-routines')
    if (raw !== null) {
      try {
        const parsed = JSON.parse(raw)
        if (Array.isArray(parsed)) return parsed
      } catch {
        // fallback
      }
    }
    const defaultRoutine = {
      id: 9999,
      user_id: 'guest',
      name: 'Rutina de Ejemplo',
      is_active: false,
      total_exercises: 5,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      exercises: [
        {
          id: 9995,
          routine_id: 9999,
          exercise_id: 100,
          exercise_name: 'Calentamiento Dinámico',
          sets: 1,
          reps: 1,
          weight: 0,
          order_index: 0,
          rest_time_seconds: 0,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        },
        {
          id: 9996,
          routine_id: 9999,
          exercise_id: 1,
          exercise_name: 'Press de Banca',
          sets: 3,
          reps: 10,
          weight: 60,
          order_index: 1,
          rest_time_seconds: 60,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        },
        {
          id: 9997,
          routine_id: 9999,
          exercise_id: 2,
          exercise_name: 'Sentadilla',
          sets: 3,
          reps: 12,
          weight: 80,
          order_index: 2,
          rest_time_seconds: 90,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        },
        {
          id: 9998,
          routine_id: 9999,
          exercise_id: 3,
          exercise_name: 'Peso Muerto',
          sets: 3,
          reps: 8,
          weight: 100,
          order_index: 3,
          rest_time_seconds: 120,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        },
        {
          id: 9999,
          routine_id: 9999,
          exercise_id: 101,
          exercise_name: 'Estiramiento',
          sets: 1,
          reps: 1,
          weight: 0,
          order_index: 4,
          rest_time_seconds: 0,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        }
      ]
    }
    const initial = [defaultRoutine]
    this.setLocalRoutines(initial)
    return initial
  }

  private setLocalRoutines(routines: any[]) {
    if (typeof window !== 'undefined') {
      localStorage.setItem('entrenate-routines', JSON.stringify(routines))
    }
  }

  // Routines API
  async getUserRoutines() {
    if (isGuestMode()) {
      return this.getLocalRoutines()
    }
    try {
      return await this.request('/routines')
    } catch {
      return this.getLocalRoutines()
    }
  }

  async getUserRoutine(id: number) {
    if (isGuestMode()) {
      const routines = this.getLocalRoutines()
      const found = routines.find(r => r.id === id)
      if (found) return found
      throw new Error(`Routine ${id} not found`)
    }
    try {
      return await this.request(`/routines/${id}`)
    } catch {
      const routines = this.getLocalRoutines()
      const found = routines.find(r => r.id === id)
      if (found) return found
      throw new Error(`Routine ${id} not found`)
    }
  }

  async createUserRoutine(routine: {
    name: string
    description?: string
    exercises?: Array<{
      exercise_id: number
      order_index: number
      sets: number
      reps: number
      weight?: number
      rest_time_seconds: number
      notes?: string
    }>
  }) {
    if (isGuestMode()) {
      return this.createLocalRoutine(routine)
    }
    try {
      return await this.request('/routines', {
        method: 'POST',
        body: routine
      })
    } catch {
      return this.createLocalRoutine(routine)
    }
  }

  private createLocalRoutine(routine: any) {
    const routines = this.getLocalRoutines()
    const newId = Date.now()
    const exercises = (routine.exercises || []).map((ex: any, idx: number) => {
      let exName = ex.exercise_name
      if (!exName) {
        const found = MOCK_EXERCISES.find(e => e.id === ex.exercise_id)
        exName = found ? found.name : `Ejercicio #${ex.exercise_id}`
      }
      return {
        id: Date.now() + idx + 1,
        routine_id: newId,
        exercise_id: ex.exercise_id,
        exercise_name: exName,
        sets: ex.sets || 3,
        reps: ex.reps || 10,
        weight: ex.weight || 0,
        order_index: ex.order_index !== undefined ? ex.order_index : idx,
        rest_time_seconds: ex.rest_time_seconds || 60,
        notes: ex.notes || '',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      }
    })

    const newRoutine = {
      id: newId,
      user_id: 'guest',
      name: routine.name,
      description: routine.description || '',
      is_active: false,
      total_exercises: exercises.length,
      exercises,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    }

    routines.unshift(newRoutine)
    this.setLocalRoutines(routines)
    return newRoutine
  }

  async updateUserRoutine(id: number, routine: {
    name?: string
    description?: string
    is_active?: boolean
    exercises?: any[]
  }) {
    if (isGuestMode()) {
      return this.updateLocalRoutine(id, routine)
    }
    try {
      return await this.request(`/routines/${id}`, {
        method: 'PUT',
        body: routine
      })
    } catch {
      return this.updateLocalRoutine(id, routine)
    }
  }

  private updateLocalRoutine(id: number, routine: any) {
    const routines = this.getLocalRoutines()
    const index = routines.findIndex(r => r.id === id)
    if (index !== -1) {
      const existing = routines[index]
      let exercises = existing.exercises || []
      if (routine.exercises) {
        exercises = routine.exercises.map((ex: any, idx: number) => {
          let exName = ex.exercise_name
          if (!exName) {
            const found = MOCK_EXERCISES.find(e => e.id === ex.exercise_id)
            exName = found ? found.name : `Ejercicio #${ex.exercise_id}`
          }
          return {
            id: ex.id || Date.now() + idx + 1,
            routine_id: id,
            exercise_id: ex.exercise_id,
            exercise_name: exName,
            sets: ex.sets || 3,
            reps: ex.reps || 10,
            weight: ex.weight || 0,
            order_index: ex.order_index !== undefined ? ex.order_index : idx,
            rest_time_seconds: ex.rest_time_seconds || 60,
            notes: ex.notes || '',
            created_at: ex.created_at || new Date().toISOString(),
            updated_at: new Date().toISOString()
          }
        })
      }

      routines[index] = {
        ...existing,
        ...routine,
        exercises,
        total_exercises: exercises.length,
        updated_at: new Date().toISOString()
      }
      this.setLocalRoutines(routines)
      return routines[index]
    }
    return routine
  }

  async deleteUserRoutine(id: number) {
    if (isGuestMode()) {
      return this.deleteLocalRoutine(id)
    }
    try {
      return await this.request(`/routines/${id}`, {
        method: 'DELETE'
      })
    } catch {
      return this.deleteLocalRoutine(id)
    }
  }

  private deleteLocalRoutine(id: number) {
    let routines = this.getLocalRoutines()
    routines = routines.filter(r => Number(r.id) !== Number(id))
    this.setLocalRoutines(routines)
    if (typeof window !== 'undefined') {
      try {
        const activeRaw = localStorage.getItem('activeRoutine')
        if (activeRaw) {
          const parsed = JSON.parse(activeRaw)
          if (Number(parsed?.routine?.id) === Number(id)) {
            localStorage.removeItem('activeRoutine')
          }
        }
      } catch {
        // ignore
      }
    }
    return { success: true }
  }
}

// Export singleton instance
export const apiClient = new ApiClient(API_BASE_URL)

// Export types for use in components
export type { ApiRequestConfig }