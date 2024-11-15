import pluginVue from 'eslint-plugin-vue'
import vueTsEslintConfig from '@vue/eslint-config-typescript'
import skipFormatting from '@vue/eslint-config-prettier/skip-formatting'

export default [
  {
    name: 'app/files-to-lint',
    files: ['**/*.{ts,mts,tsx,vue}'],
  },

  {
    name: 'app/files-to-ignore',
    ignores: ['**/dist/**', '**/dist-ssr/**', '**/coverage/**'],
  },

  // Vue essential rules configuration
  ...pluginVue.configs['flat/essential'],

  // TypeScript-specific ESLint config for Vue
  ...vueTsEslintConfig(),

  // Skip formatting rules if needed
  skipFormatting,

  // Optional: Add any custom or additional rules here
  {
    name: 'app/custom-rules',
    rules: {
      '@typescript-eslint/no-unused-expressions': ['error', { allowShortCircuit: true }],
      // Add other custom rules if required
    },
  },
]
