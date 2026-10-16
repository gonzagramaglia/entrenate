import { Box } from '@mui/material'
import { TABS, type TabType } from '../../constants/tabs'
import WorkoutForm from '../workout/WorkoutForm'
import WorkoutHistory from '../workout/WorkoutHistory'
import RoutineList from '../routines/RoutineList'
import ExerciseList from '../exercises/ExerciseList'
import { MOCK_EXERCISES } from '../../lib/mockExercises'

type AppRouterProps = {
  activeTab: TabType
  exercises: any[]
  handleWorkoutSubmit: (data: any) => Promise<void>
  isSubmittingWorkout: boolean
  activeRoutine: any
  isRoutinePaused: boolean
  handleStopRoutine: () => void
  preloadedExercise: any
  handleNavigateToRoutines: () => void
  userRole: string | undefined
  isAdmin: boolean
  routineProgress: number
}

export default function AppRouter({
  activeTab,
  exercises,
  handleWorkoutSubmit,
  isSubmittingWorkout,
  activeRoutine,
  isRoutinePaused,
  handleStopRoutine,
  preloadedExercise,
  handleNavigateToRoutines,
  userRole,
  isAdmin,
  routineProgress
}: AppRouterProps) {
  switch (activeTab) {
    case TABS.WORKOUT:
      return (
        <Box sx={{
          position: 'relative',
          zIndex: 1,
          height: '100%',
          overflow: activeRoutine ? 'auto' : 'hidden',
          px: { xs: 2, sm: 1 },
          pb: 0,
          '&::-webkit-scrollbar': { display: 'none' },
          '&::-moz-scrollbar': { display: 'none' },
          scrollbarWidth: 'none',
          msOverflowStyle: 'none'
        }}>
          <WorkoutForm
            exercises={exercises}
            onSubmit={handleWorkoutSubmit}
            isLoading={isSubmittingWorkout}
            activeRoutine={activeRoutine}
            isRoutinePaused={isRoutinePaused}
            onStopRoutine={handleStopRoutine}
            preloadedExercise={preloadedExercise}
            onNavigateToRoutines={handleNavigateToRoutines}
            userRole={userRole}
            isAdmin={isAdmin}
          />
        </Box>
      )
    case TABS.HISTORY:
      return (
        <Box sx={{ height: '100%' }}>
          <WorkoutHistory />
        </Box>
      )
    case TABS.ROUTINES:
      return (
        <Box sx={{ height: '100%' }}>
          <RoutineList activeRoutine={activeRoutine} routineProgress={routineProgress} />
        </Box>
      )
    case TABS.EXERCISES:
      return (
        <Box sx={{ minHeight: 'calc(100vh - 200px)' }}>
          <ExerciseList
            exercises={exercises && exercises.length > 0 ? exercises : MOCK_EXERCISES}
            onSelectExercise={(exercise) => console.log('Ejercicio seleccionado:', exercise)}
          />
        </Box>
      )
    default:
      return null
  }
}
