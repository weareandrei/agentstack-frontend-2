<script setup lang="ts">
import DashboardSidebar from './components/DashboardSidebar.vue'
import CreateProjectDialog from './components/CreateProjectDialog.vue'
import RenameProjectDialog from './components/RenameProjectDialog.vue'
import DeleteProjectDialog from './components/DeleteProjectDialog.vue'
import { useDashboardLayout } from './composables/useDashboardLayout'

const {
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
} = useDashboardLayout()
</script>

<template>
  <div class="mt-14 flex h-[calc(100vh-3.5rem)]">
    <DashboardSidebar
      :route-path="route.path"
      :projects="projects"
      :selected-project-id="selectedProjectId"
      :is-loading-projects="isLoadingProjects"
      @select-project="selectProject"
      @create-project="createProjectOpen = true"
      @rename-project="openRenameDialog"
      @delete-project="openDeleteDialog"
    />

    <main class="flex min-w-0 flex-1 flex-col overflow-hidden">
      <router-view />
    </main>

    <CreateProjectDialog
      v-model:open="createProjectOpen"
      v-model:new-project-name="newProjectName"
      :created-token="createdToken"
      :selected-project-name="selectedProject?.name"
      :error-message="errorMessage"
      :is-creating="isCreating"
      :token-copied="tokenCopied"
      @create="createProject"
      @close="closeCreateProject"
      @copy-token="copyCreatedToken"
    />

    <RenameProjectDialog
      v-model:open="renameProjectOpen"
      v-model:rename-project-name="renameProjectName"
      :rename-error="renameError"
      :is-renaming="isRenaming"
      @submit="submitRename"
      @close="closeRenameDialog"
    />

    <DeleteProjectDialog
      v-model:open="deleteProjectOpen"
      :delete-project-name="deleteProjectName"
      :delete-error="deleteError"
      :is-deleting="isDeleting"
      @submit="submitDelete"
      @close="closeDeleteDialog"
    />
  </div>
</template>
