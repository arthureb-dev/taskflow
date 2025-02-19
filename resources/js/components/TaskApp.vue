<template>
    <div class="min-h-screen bg-gray-50 px-4 py-8 dark:bg-gray-900 dark:text-gray-100">
        <div class="absolute top-4 right-4 flex space-x-3">
            <!-- Refresh Tasks -->
            <button
                aria-label="refresh-tasks"
                class="cursor-pointer rounded bg-gray-200 p-2 transition-colors dark:bg-gray-700"
                @click="fetchTasks()"
            >
                <ArrowPathIcon class="h-5 w-5 text-gray-500 dark:text-gray-300" />
            </button>
            <!-- Toggle light / dark mode -->
            <button
                aria-label="toggle-dark-mode"
                class="cursor-pointer rounded bg-gray-200 p-2 transition-colors dark:bg-gray-700"
                @click="toggleDarkMode"
            >
                <SunIcon v-if="isDark" class="h-5 w-5 text-gray-800 dark:text-yellow-400" />
                <MoonIcon v-else class="h-5 w-5 text-gray-800 dark:text-white" />
            </button>
        </div>

        <div class="mx-auto max-w-2xl">
            <!-- Header -->
            <div class="mb-8 flex items-center justify-center gap-3">
                <ListBulletIcon class="h-10 w-10 text-purple-500 dark:text-purple-300" />
                <h1 class="text-4xl font-light text-gray-900 dark:text-gray-100">TaskFlow</h1>
            </div>

            <!-- Add Task Form -->
            <form class="mb-8" @submit.prevent="addTask">
                <div class="flex gap-2">
                    <input
                        v-model="newTask"
                        type="text"
                        placeholder="Add a new task..."
                        class="flex-1 rounded-lg border border-gray-200 bg-white px-4 py-3 shadow-sm transition-all duration-300 focus:border-transparent focus:ring-2 focus:ring-purple-500 focus:outline-none dark:border-gray-600 dark:bg-gray-800 dark:text-gray-100 dark:placeholder-gray-500"
                    />

                    <button
                        aria-label="submit-task"
                        type="submit"
                        class="flex items-center justify-center gap-2 rounded-lg px-6 py-3 text-white shadow-sm transition-all duration-300 focus:ring-2 focus:ring-offset-2 focus:outline-none"
                        :class="
                            loading
                                ? 'cursor-not-allowed bg-gray-400 dark:bg-gray-600'
                                : 'cursor-pointer bg-purple-500 hover:bg-purple-600 dark:bg-purple-600 dark:hover:bg-purple-700'
                        "
                        :disabled="loading"
                    >
                        <Spinner v-if="loading" customClass="mr-2 size-5 animate-spin text-white" />
                        <PlusCircleIcon v-else class="size-6 stroke-2" />
                        {{ loading ? 'Saving…' : 'Add Task' }}
                    </button>
                </div>
                <p v-if="errors.content" class="mt-1 text-sm text-red-500">
                    {{ errors.content[0] }}
                </p>
            </form>

            <!-- Task List -->
            <div v-if="loading" class="flex items-center justify-center">
                <Spinner />
            </div>

            <div v-else class="space-y-3">
                <div
                    v-for="task in tasks"
                    :key="task.id"
                    :class="`group rounded-lg border border-gray-200 p-4 shadow-sm transition-all duration-300 hover:shadow-md dark:border-gray-600 ${task.completed ? 'bg-gray-50 dark:bg-gray-800/50' : 'bg-white dark:bg-gray-800'}`"
                >
                    <div class="flex items-start gap-3">
                        <!-- Checkbox -->
                        <button
                            :aria-label="'toggle-task'"
                            :class="`mt-1 flex h-5 w-5 cursor-pointer items-center justify-center rounded-full border-2 transition-all duration-300 ${task.completed ? 'border-purple-500 bg-purple-500' : 'border-gray-300 hover:border-purple-500 dark:border-gray-500'}`"
                            :disabled="activeTaskId === task.id"
                            @click="toggleTask(task.id)"
                        >
                            <CheckIcon class="h-3 w-3 text-white dark:text-gray-800" />
                        </button>

                        <!-- Content -->
                        <div class="flex-1">
                            <div
                                :class="`prose prose-sm max-w-none ${task.completed ? 'text-gray-500 line-through dark:text-gray-400/80' : 'text-gray-900 dark:text-gray-100'}`"
                            >
                                {{ task.content }}
                            </div>
                        </div>

                        <!-- Actions -->
                        <div class="flex gap-2">
                            <button
                                :aria-label="'delete-task'"
                                class="text-gray-400 opacity-0 transition-opacity duration-300 group-hover:opacity-100 hover:text-red-500"
                                :disabled="activeTaskId === task.id"
                                @click="deleteTask(task.id)"
                            >
                                <TrashIcon
                                    v-if="activeTaskId !== task.id"
                                    class="h-5 w-5 cursor-pointer dark:text-gray-400 dark:hover:text-red-400"
                                />
                                <Spinner
                                    v-else
                                    customClass="mr-2 size-5 animate-spin text-purple-500 dark:text-purple-300"
                                />
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Pagination -->
            <div class="mt-8 flex justify-center space-x-2">
                <button
                    v-if="prevPage"
                    aria-label="prev-page"
                    class="relative inline-flex cursor-pointer items-center rounded bg-purple-500 px-4 py-2 text-white shadow-sm dark:bg-purple-600"
                    @click="fetchTasks(prevPage)"
                >
                    <ChevronLeftIcon class="size-4 stroke-2" /> Prev
                </button>
                <button
                    v-if="nextPage"
                    aria-label="next-page"
                    class="relative inline-flex cursor-pointer items-center rounded bg-purple-500 px-4 py-2 text-white shadow-sm dark:bg-purple-600"
                    @click="fetchTasks(nextPage)"
                >
                    Next <ChevronRightIcon class="size-4 stroke-2" />
                </button>
            </div>

            <!-- Empty State -->
            <div
                v-if="tasks.length === 0 && !loading"
                class="mt-8 text-center text-gray-500 dark:text-gray-400"
            >
                You have no tasks. Time to create your first one!
            </div>
        </div>
    </div>
</template>

<script setup>
    import { ref, onMounted, watch } from 'vue'
    import {
        ListBulletIcon,
        CheckIcon,
        ChevronRightIcon,
        ChevronLeftIcon,
        ArrowPathIcon,
    } from '@heroicons/vue/24/solid'
    import { PlusCircleIcon, TrashIcon, MoonIcon, SunIcon } from '@heroicons/vue/24/outline'
    import { toast } from 'vue3-toastify'
    import Spinner from './Spinner.vue'

    const tasks = ref([])
    const newTask = ref('')
    const errors = ref({})
    const loading = ref(false)
    const activeTaskId = ref(null)
    const nextPage = ref(null)
    const prevPage = ref(null)
    const isDark = ref(false)

    // Fetch tasks
    const fetchTasks = async (url = '/api/tasks') => {
        loading.value = true
        try {
            const { data } = await axios.get(url)
            tasks.value = data.data
            nextPage.value = data.links.next
            prevPage.value = data.links.prev
        } catch (error) {
            toast.error(
                error.response?.data?.meta?.toastMessage ||
                    'Oops! We couldn’t fetch your tasks. Please try again.'
            )
        } finally {
            loading.value = false
        }
    }

    // Add task
    const addTask = async () => {
        loading.value = true
        errors.value = {}

        try {
            const { data } = await axios.post('/api/tasks', { content: newTask.value })
            tasks.value.unshift(data.data)
            newTask.value = ''
            toast.success(data.meta.toastMessage)
        } catch (error) {
            if (error.response?.data?.errors) errors.value = error.response.data.errors
            toast.error(
                error.response?.data?.meta?.toastMessage ||
                    'We couldn’t save that. Make sure it isn’t empty!'
            )
        } finally {
            loading.value = false
        }
    }
    // Toggle completion
    const toggleTask = async (id) => {
        if (activeTaskId.value) return

        activeTaskId.value = id

        try {
            const { data } = await axios.patch(`/api/tasks/${id}`)
            tasks.value = tasks.value.map((task) => {
                return task.id === id ? data.data : task
            })

            const message = data.meta?.toastMessage || 'Task updated!'
            toast.success(message)
        } catch (error) {
            const errorMsg =
                error.response?.data?.meta?.toastMessage ||
                'Something went wrong while updating. Please try again.'
            toast.error(errorMsg)
        } finally {
            activeTaskId.value = null
        }
    }

    // Delete task
    const deleteTask = async (id) => {
        if (!confirm('Are you sure? This action cannot be undone.')) return
        activeTaskId.value = id

        try {
            const response = await axios.delete(`/api/tasks/${id}`)
            const { data } = response

            tasks.value = tasks.value.filter((task) => task.id !== data.data.id)
            toast.success(data.meta.toastMessage)
        } catch (error) {
            toast.error(
                error.response?.data?.meta?.toastMessage ||
                    'Failed to delete the task. Please try again.'
            )
        } finally {
            activeTaskId.value = null
        }
    }

    function toggleDarkMode() {
        isDark.value = !isDark.value
        localStorage.setItem('theme', isDark.value ? 'dark' : 'light')
    }

    watch(
        () => isDark.value,
        (dark) => {
            const htmlEl = document.documentElement
            if (dark) htmlEl.classList.add('dark')
            else htmlEl.classList.remove('dark')
        },
        { immediate: true }
    )

    onMounted(() => {
        if (localStorage.getItem('theme') === 'dark') {
            isDark.value = true
        }

        // fetch initial tasks
        fetchTasks()
    })
</script>
