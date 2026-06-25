import { computed, onMounted, ref, watch } from 'vue'
import ALGORITHM from '@/lib/algorithm'
import { useProjects } from './useProjects'

export interface LogItem {
  id: number
  level: string
  message: string
  logged_at: string
  received_at?: string
  metadata?: Record<string, unknown>
}

export type DatePreset = '1h' | '6h' | '24h' | 'all' | 'custom'

const toDatetimeLocalValue = (date: Date): string => {
  const pad = (value: number) => String(value).padStart(2, '0')
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}T${pad(date.getHours())}:${pad(date.getMinutes())}`
}

const defaultDateRange = () => {
  const to = new Date()
  const from = new Date(to.getTime() - 24 * 60 * 60 * 1000)
  return { from, to }
}

export const useProjectLogs = () => {
  const { selectedProjectId } = useProjects()

  const logs = ref<LogItem[]>([])
  const errorMessage = ref('')
  const isLoadingLogs = ref(false)

  const activePreset = ref<DatePreset>('24h')
  const initialRange = defaultDateRange()
  const dateFrom = ref(toDatetimeLocalValue(initialRange.from))
  const dateTo = ref(toDatetimeLocalValue(initialRange.to))
  const appliedFrom = ref(dateFrom.value)
  const appliedTo = ref(dateTo.value)

  const hasPendingDateChanges = computed(
    () => dateFrom.value !== appliedFrom.value || dateTo.value !== appliedTo.value,
  )

  const loadLogs = async () => {
    if (!selectedProjectId.value) {
      logs.value = []
      return
    }

    isLoadingLogs.value = true
    try {
      const params =
        activePreset.value === 'all'
          ? undefined
          : {
              from: new Date(appliedFrom.value).toISOString(),
              to: new Date(appliedTo.value).toISOString(),
            }

      logs.value = await ALGORITHM.getLogs(selectedProjectId.value, params)
    } catch (err) {
      errorMessage.value = (err as Error).message
    } finally {
      isLoadingLogs.value = false
    }
  }

  const applyPreset = async (preset: Exclude<DatePreset, 'custom'>) => {
    activePreset.value = preset

    if (preset !== 'all') {
      const to = new Date()
      const hours = preset === '1h' ? 1 : preset === '6h' ? 6 : 24
      const from = new Date(to.getTime() - hours * 60 * 60 * 1000)

      dateFrom.value = toDatetimeLocalValue(from)
      dateTo.value = toDatetimeLocalValue(to)
    }

    appliedFrom.value = dateFrom.value
    appliedTo.value = dateTo.value
    await loadLogs()
  }

  const applyCustomRange = async () => {
    activePreset.value = 'custom'
    appliedFrom.value = dateFrom.value
    appliedTo.value = dateTo.value
    await loadLogs()
  }

  watch(selectedProjectId, () => {
    void loadLogs()
  })

  onMounted(() => {
    void loadLogs()
  })

  return {
    logs,
    errorMessage,
    isLoadingLogs,
    activePreset,
    dateFrom,
    dateTo,
    hasPendingDateChanges,
    loadLogs,
    applyPreset,
    applyCustomRange,
  }
}
