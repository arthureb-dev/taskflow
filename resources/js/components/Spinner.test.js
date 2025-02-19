import { mount } from '@vue/test-utils'
import Spinner from '../components/Spinner.vue'
import { describe, it, expect } from 'vitest'

describe('Spinner.vue', () => {
    it('renders with default classes when no customClass prop is provided', () => {
        const wrapper = mount(Spinner)
        expect(wrapper.classes()).toContain('h-8')
        expect(wrapper.classes()).toContain('w-8')
        expect(wrapper.classes()).toContain('animate-spin')
        expect(wrapper.classes()).toContain('text-purple-500')
        expect(wrapper.classes()).toContain('dark:text-purple-300')
    })

    it('renders with provided customClass prop', () => {
        const customClass = 'my-custom-class'
        const wrapper = mount(Spinner, {
            props: { customClass },
        })
        expect(wrapper.classes()).toContain(customClass)
    })
})
