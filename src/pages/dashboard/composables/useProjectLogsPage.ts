import { useProjects } from './useProjects'
import { useProjectLogs } from './useProjectLogs'

export const useProjectLogsPage = () => {
  const { selectedProject, isLoadingProjects, createProjectOpen } = useProjects()

  const {
    logs,
    errorMessage,
    isLoadingLogs,
    activePreset,
    dateFrom,
    dateTo,
    hasPendingDateChanges,
    applyPreset,
    applyCustomRange,
  } = useProjectLogs()

  return {
    selectedProject,
    isLoadingProjects,
    createProjectOpen,
    logs,
    errorMessage,
    isLoadingLogs,
    activePreset,
    dateFrom,
    dateTo,
    hasPendingDateChanges,
    applyPreset,
    applyCustomRange,
  }
}
