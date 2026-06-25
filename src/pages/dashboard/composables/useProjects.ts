import { computed, ref } from 'vue'
import ALGORITHM from '@/lib/algorithm'

export interface Project {
  id: string
  name: string
  token_prefix: string
  created_at: string
}

const projects = ref<Project[]>([])
const selectedProjectId = ref<string | null>(null)
const newProjectName = ref('')
const createdToken = ref('')
const errorMessage = ref('')
const isCreating = ref(false)
const isLoadingProjects = ref(true)
const createProjectOpen = ref(false)
const projectTokens = ref<Record<string, string>>({})

export const useProjects = () => {
  const selectedProject = computed(
    () => projects.value.find((project) => project.id === selectedProjectId.value) ?? null,
  )

  const loadProjects = async () => {
    isLoadingProjects.value = true
    try {
      projects.value = await ALGORITHM.listProjects()
      const first = projects.value[0]
      if (first && !selectedProjectId.value) {
        selectedProjectId.value = first.id
      }
    } catch (err) {
      errorMessage.value = (err as Error).message
    } finally {
      isLoadingProjects.value = false
    }
  }

  const selectProject = (id: string) => {
    selectedProjectId.value = id
  }

  const createProject = async () => {
    errorMessage.value = ''
    createdToken.value = ''
    if (!newProjectName.value.trim()) {
      errorMessage.value = 'Name is required'
      return
    }

    isCreating.value = true
    try {
      const project = await ALGORITHM.createProject(newProjectName.value.trim())
      createdToken.value = project.token
      if (project.token) {
        projectTokens.value = { ...projectTokens.value, [project.id]: project.token }
      }
      newProjectName.value = ''
      await loadProjects()
      selectedProjectId.value = project.id
    } catch (err) {
      errorMessage.value = (err as Error).message
    } finally {
      isCreating.value = false
    }
  }

  const closeCreateProject = () => {
    createProjectOpen.value = false
    newProjectName.value = ''
    createdToken.value = ''
    errorMessage.value = ''
  }

  const rotateProjectToken = async (projectId: string) => {
    const project = await ALGORITHM.rotateProjectToken(projectId)
    projectTokens.value = { ...projectTokens.value, [project.id]: project.token }
    projects.value = projects.value.map((item) =>
      item.id === project.id ? { ...item, token_prefix: project.token_prefix } : item,
    )
    return project
  }

  const renameProject = async (projectId: string, name: string) => {
    const project = await ALGORITHM.renameProject(projectId, name)
    projects.value = projects.value.map((item) =>
      item.id === project.id ? { ...item, name: project.name } : item,
    )
    return project
  }

  const deleteProject = async (projectId: string) => {
    await ALGORITHM.deleteProject(projectId)
    const { [projectId]: _removed, ...remainingTokens } = projectTokens.value
    projectTokens.value = remainingTokens
    projects.value = projects.value.filter((item) => item.id !== projectId)

    if (selectedProjectId.value === projectId) {
      selectedProjectId.value = projects.value[0]?.id ?? null
    }
  }

  return {
    projects,
    selectedProjectId,
    selectedProject,
    newProjectName,
    createdToken,
    errorMessage,
    isCreating,
    isLoadingProjects,
    createProjectOpen,
    projectTokens,
    loadProjects,
    selectProject,
    createProject,
    closeCreateProject,
    rotateProjectToken,
    renameProject,
    deleteProject,
  }
}
