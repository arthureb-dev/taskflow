import { mount } from '@vue/test-utils'
import TaskApp from '../components/TaskApp.vue'
import { vi } from 'vitest'
import { flushPromises } from '@vue/test-utils'
import Vue3Toastify from 'vue3-toastify'
import '../bootstrap'

vi.mock('axios', () => ({
    default: {
        get: vi.fn(),
        post: vi.fn(),
        patch: vi.fn(),
        delete: vi.fn(),
        defaults: {
            headers: {
                common: {
                    'X-Requested-With': 'XMLHttpRequest',
                },
            },
        },
    },
}))

describe('TaskApp.vue', () => {
    let wrapper

    const mountComponent = () => {
        return mount(TaskApp, {
            global: {
                plugins: [
                    [
                        Vue3Toastify,
                        {
                            autoClose: 1000,
                            theme: 'colored',
                            transition: 'flip',
                            limit: 1,
                        },
                    ],
                ],
                stubs: {
                    ListBulletIcon: true,
                    CheckIcon: true,
                    ChevronRightIcon: true,
                    ChevronLeftIcon: true,
                    ArrowPathIcon: true,
                    PlusCircleIcon: true,
                    TrashIcon: true,
                    MoonIcon: true,
                    SunIcon: true,
                },
            },
        })
    }

    beforeEach(() => {
        vi.resetAllMocks()
        // Default axios mock response
        window.axios.get.mockResolvedValue({
            data: {
                data: [],
                links: { next: null, prev: null },
            },
        })
    })

    afterEach(() => {
        wrapper?.unmount()
    })

    it('renders the component', async () => {
        wrapper = mountComponent()
        await flushPromises()
        expect(wrapper.exists()).toBe(true)
    })

    it('fetches tasks on mount', async () => {
        const mockTasks = [
            { id: 1, content: 'Test Task 1', completed: false },
            { id: 2, content: 'Test Task 2', completed: true },
        ]

        window.axios.get.mockResolvedValueOnce({
            data: {
                data: mockTasks,
                links: { next: null, prev: null },
            },
        })

        wrapper = mountComponent()
        await flushPromises()

        expect(window.axios.get).toHaveBeenCalledWith('/api/tasks')
        expect(wrapper.vm.tasks).toEqual(mockTasks)
    })

    it('adds a new task', async () => {
        const newTask = { id: 3, content: 'New Task', completed: false }

        wrapper = mountComponent()
        await flushPromises()

        window.axios.post.mockResolvedValueOnce({
            data: {
                data: newTask,
                meta: { toastMessage: 'Task created successfully!' },
            },
        })

        const input = wrapper.find('input[type="text"]')
        await input.setValue('New Task')
        await wrapper.find('form').trigger('submit.prevent')
        await flushPromises()

        expect(window.axios.post).toHaveBeenCalledWith('/api/tasks', { content: 'New Task' })
        expect(wrapper.vm.tasks).toContainEqual(newTask)
    })

    it('toggles task completion', async () => {
        const task = { id: 1, content: 'Test Task', completed: false }
        const updatedTask = { ...task, completed: true }

        window.axios.get.mockResolvedValueOnce({
            data: {
                data: [task],
                links: { next: null, prev: null },
            },
        })

        wrapper = mountComponent()
        await flushPromises()

        window.axios.patch.mockResolvedValueOnce({
            data: {
                data: updatedTask,
                meta: { toastMessage: 'Task updated!' },
            },
        })

        const toggleButton = wrapper.find('button[aria-label="toggle-task"]')
        await toggleButton.trigger('click')
        await flushPromises()

        expect(wrapper.vm.tasks[0].completed).toBe(true)
    })

    it('deletes a task', async () => {
        const task = { id: 1, content: 'Test Task', completed: false }

        window.axios.get.mockResolvedValueOnce({
            data: {
                data: [task],
                links: { next: null, prev: null },
            },
        })

        wrapper = mountComponent()
        await flushPromises()

        // Mock confirm dialog
        vi.spyOn(window, 'confirm').mockImplementation(() => true)

        window.axios.delete.mockResolvedValueOnce({
            data: {
                data: { id: 1 },
                meta: { toastMessage: 'Task deleted!' },
            },
        })

        const deleteButton = wrapper.find('button[aria-label="delete-task"]')
        await deleteButton.trigger('click')
        await flushPromises()

        expect(wrapper.vm.tasks).toHaveLength(0)
    })

    it('toggles dark mode', async () => {
        wrapper = mountComponent()
        await flushPromises()

        expect(wrapper.vm.isDark).toBe(false)
        await wrapper.vm.toggleDarkMode()
        expect(wrapper.vm.isDark).toBe(true)
    })

    it('renders dark mode classes when dark mode is enabled', async () => {
        wrapper = mountComponent()
        await flushPromises()

        wrapper.vm.isDark = true
        await wrapper.vm.$nextTick()
        expect(document.documentElement.classList.contains('dark')).toBe(true)
    })
})
