import type { Config } from 'jest'
import nextJest from 'next/jest.js'

const createJestConfig = nextJest({ dir: './' })

const config: Config = {
  coverageProvider: 'v8',
  testEnvironment: 'jsdom',
  // Nota: la opción correcta de Jest es `setupFilesAfterEnv`
  // (la especificación traía `setupFilesAfterFramework`, que Jest ignora).
  setupFilesAfterEnv: ['<rootDir>/jest.setup.ts'],
}

export default createJestConfig(config)
