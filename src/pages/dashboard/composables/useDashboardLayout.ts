import { onMounted, ref, watch } from 'vue'
import { useRoute } from 'vue-router'
import { useProjects } from './useProjects'

export const useDashboardLayout = () => {
  const route = useRoute()

  const {
    projects,
    selectedProjectId,
    selectedProject,
    newProjectName,
    createdToken,
    errorMessage,
    isCreating,
    isLoadingProjects,
    createProjectOpen,
    loadProjects,
    selectProject,
    createProject,
    closeCreateProject,
    renameProject,
    deleteProject,
  } = useProjects()

  const tokenCopied = ref(false)

  const renameProjectOpen = ref(false)
  const renameProjectId = ref<string | null>(null)
  const renameProjectName = ref('')
  const isRenaming = ref(false)
  const renameError = ref('')

  const deleteProjectOpen = ref(false)
  const deleteProjectId = ref<string | null>(null)
  const deleteProjectName = ref('')
  const isDeleting = ref(false)
  const deleteError = ref('')

  const openRenameDialog = (project: { id: string; name: string }) => {
    renameProjectId.value = project.id
    renameProjectName.value = project.name
    renameError.value = ''
    renameProjectOpen.value = true
  }

  const closeRenameDialog = () => {
    renameProjectOpen.value = false
    renameProjectId.value = null
    renameProjectName.value = ''
    renameError.value = ''
  }

  const submitRename = async () => {
    if (!renameProjectId.value) return
    if (!renameProjectName.value.trim()) {
      renameError.value = 'Name is required'
      return
    }

    isRenaming.value = true
    renameError.value = ''
    try {
      await renameProject(renameProjectId.value, renameProjectName.value.trim())
      closeRenameDialog()
    } catch (err) {
      renameError.value = (err as Error).message
    } finally {
      isRenaming.value = false
    }
  }

  const openDeleteDialog = (project: { id: string; name: string }) => {
    deleteProjectId.value = project.id
    deleteProjectName.value = project.name
    deleteError.value = ''
    deleteProjectOpen.value = true
  }

  const closeDeleteDialog = () => {
    deleteProjectOpen.value = false
    deleteProjectId.value = null
    deleteProjectName.value = ''
    deleteError.value = ''
  }

  const submitDelete = async () => {
    if (!deleteProjectId.value) return

    isDeleting.value = true
    deleteError.value = ''
    try {
      await deleteProject(deleteProjectId.value)
      closeDeleteDialog()
    } catch (err) {
      deleteError.value = (err as Error).message
    } finally {
      isDeleting.value = false
    }
  }

  const copyCreatedToken = async () => {
    try {
      await navigator.clipboard.writeText(createdToken.value)
      tokenCopied.value = true
      window.setTimeout(() => {
        tokenCopied.value = false
      }, 2000)
    } catch {
      errorMessage.value = 'Could not copy to clipboard'
    }
  }

  watch(createProjectOpen, (open) => {
    if (!open) {
      newProjectName.value = ''
      createdToken.value = ''
      errorMessage.value = ''
      tokenCopied.value = false
    }
  })

  onMounted(() => {
    void loadProjects()
  })

  return {
    route,
    projects,
    selectedProjectId,
    selectedProject,
    newProjectName,
    createdToken,
    errorMessage,
    isCreating,
    isLoadingProjects,
    createProjectOpen,
    selectProject,
    createProject,
    closeCreateProject,
    tokenCopied,
    copyCreatedToken,
    renameProjectOpen,
    renameProjectName,
    isRenaming,
    renameError,
    openRenameDialog,
    closeRenameDialog,
    submitRename,
    deleteProjectOpen,
    deleteProjectName,
    isDeleting,
    deleteError,
    openDeleteDialog,
    closeDeleteDialog,
    submitDelete,
  }
}
