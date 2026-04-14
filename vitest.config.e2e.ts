import { defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
    include: ['src/http/controller/**/*.spec.ts'],
    environment: 'node',
    pool: 'forks', 
    maxWorkers: 1,    
  },
})