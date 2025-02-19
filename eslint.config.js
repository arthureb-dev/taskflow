import js from '@eslint/js'
import vue from 'eslint-plugin-vue'
import parser from 'vue-eslint-parser'
import prettier from 'eslint-config-prettier'
import globals from 'globals'

export default [
    {
        ignores: ['dist', 'node_modules', 'vendor'],
    },
    {
        ...js.configs.recommended,
        files: ['**/*.js', '**/*.vue'],
        languageOptions: {
            ecmaVersion: 'latest',
            sourceType: 'module',
            globals: {
                ...globals.browser,
                axios: 'readonly',
                confirm: 'readonly',
                localStorage: 'readonly',
                vi: 'readonly',
                describe: 'readonly',
                it: 'readonly',
                expect: 'readonly',
                beforeEach: 'readonly',
                afterEach: 'readonly',
                beforeAll: 'readonly',
                afterAll: 'readonly',
                test: 'readonly',
                jest: 'readonly',
            },
        },
        plugins: {
            vue,
        },
        rules: {
            ...js.configs.recommended.rules,
        },
    },
    {
        files: ['**/*.vue'],
        languageOptions: {
            parser,
            ecmaVersion: 'latest',
            sourceType: 'module',
            globals: {
                ...globals.browser,
                axios: 'readonly',
                confirm: 'readonly',
                localStorage: 'readonly',
                vi: 'readonly',
                describe: 'readonly',
                it: 'readonly',
                expect: 'readonly',
                beforeEach: 'readonly',
                afterEach: 'readonly',
                beforeAll: 'readonly',
                afterAll: 'readonly',
                test: 'readonly',
                jest: 'readonly',
            },
        },
        plugins: {
            vue,
        },
        rules: {
            ...vue.configs['vue3-recommended'].rules,
            'vue/html-self-closing': 'off',
            'vue/max-attributes-per-line': 'off',
        },
    },
    {
        rules: {
            ...prettier.rules,
        },
    },
]
